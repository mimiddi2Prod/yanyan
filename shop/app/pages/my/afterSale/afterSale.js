// pages/my/afterSale/afterSale.js
const server = require('../../../utils/server.js')
const api = require('../../../config/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sliderOffset: 0,
    navList: [{
      id: 0,
      name: '申请售后',
      sliderOffset: 0
    }, {
      id: 1,
      name: '售后记录',
      sliderOffset: ''
    }],
    currentId: 0,

    orderList: [{
      status: 0, // 申请售后
      last_id: 0, // 上划加载tag
      list: []
    }, {
      status: 1, // 售后记录
      last_id: 0,
      list: []
    }],
    winHeight: 0,
    calc: 0,
    windowWidth: 0,
    isReachBottom: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;

        var calc = clientHeight * rpxR;
        // console.info(calc)
        for (var i in that.data.navList) {
          that.data.navList[i].sliderOffset = res.windowWidth / that.data.navList.length * i
        }
        that.setData(that.data)
        that.setData({
          sliderOffset: res.windowWidth / that.data.navList.length * that.data.currentId,
          windowWidth: res.windowWidth,
          winHeight: calc + 10,
          calc: calc
        });
      }
    });

    this.getAfterSale(0)
  },

  getAfterSale: function(status) {
    // status:0申请售后 1售后记录
    var self = this
    wx.showLoading({
      title: '加载中...',
    })
    var last_id = ''
    if (status == 0) {
      // 申请售后
      last_id = self.data.orderList[0].last_id
    } else if (status == 1) {
      // 售后记录
      last_id = self.data.orderList[1].last_id
    }
    server.api(api.getAfterSale, {
      user_id: app.globalData.user_id,
      status: status,
      last_id: last_id
    }, "post").then(function(res) {
      if (res.length > 0) {
        // console.info(res)
        res = res.map(function(eData){
          eData.imageO = eData.image + '?imageView2/0/w/300/h/300'
          return eData
        })
        if (status == 0) {
          self.data.orderList[0].list = self.data.orderList[0].list.concat(res)
          self.data.orderList[0].last_id++
        } else if (status == 1) {
          self.data.orderList[1].list = self.data.orderList[1].list.concat(res)
          self.data.orderList[1].last_id++
        }

        for (let i in self.data.orderList) {
          if (self.data.orderList[i].list.length > 0) {
            self.data.orderList[i].list = self.data.orderList[i].list.map(function(e) {
              if(e.select_card_id){
                // e.total = Number(e.number * e.discount_price).toFixed(2)
                e.total = (e.discount_price_total).toFixed(2)
              }else{
                e.total = Number(e.number * e.single_price).toFixed(2)
              }
              
              return e
            })
          }
        }

        self.setData(self.data)
        wx.hideLoading()
      } else {
        wx.hideLoading()
        if (self.data.isReachBottom) {
          wx.showToast({
            title: '没有更多数据啦~',
            icon: 'none'
          })
          self.setData({
            isReachBottom: false
          })
        }
      }
    })
  },

  switchCate: function(e) {
    // console.info(e.currentTarget.offsetLeft)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      currentId: e.target.dataset.id
    })
  },

  swiper: function(e) {
    // console.info(e)
    this.setData({
      sliderOffset: this.data.windowWidth / this.data.navList.length * e.detail.current,
      currentId: e.detail.current,
    })
    var currentId = e.detail.current
    // if (currentId == 0 && this.data.orderList[0].list.length <= 0) {
    //   // 申请售后
    //   this.getAfterSale(0)
    // } else if (currentId == 1 && this.data.orderList[1].list.length <= 0) {
    //   // 售后记录
    //   this.getAfterSale(1)
    // }
    this.setData({
      orderList: [{
        status: 0, // 申请售后
        last_id: 0, // 上划加载tag
        list: []
      }, {
        status: 1, // 售后记录
        last_id: 0,
        list: []
      }],
    })
    if (currentId == 0) {
      // 申请售后
      this.getAfterSale(0)
    } else if (currentId == 1) {
      // 售后记录
      this.getAfterSale(1)
    }
  },

  acceptOrder: function(e) {
    // console.info(e.currentTarget.dataset)
    var orderId = e.currentTarget.dataset.orderid
    var item_price_id = e.currentTarget.dataset.itempriceid
    var self = this
    // console.info(orderId)
    wx.showModal({
      content: '确认收货吗？',
      success: function(res) {
        if (res.confirm) {
          self.changeOrderState(orderId, 3, item_price_id)
        }
      }
    })
  },

  changeOrderState: function(orderId, willChangeState, itemPriceId) {
    var self = this
    // -1 取消订单 1已支付 3已收货
    server.api(api.changeOrderState, {
      order_id: orderId,
      state: willChangeState,
      item_price_id: itemPriceId
    }, "post").then(function(res) {
      if (res.text == "更新订单成功") {
        // 刷新
        if (self.data.currentId == 0) {
          // 申请售后
          self.data.orderList[0].list = []
          self.data.orderList[0].last_id = 0
        } else if (self.data.currentId == 1) {
          // 售后记录
          self.data.orderList[1].list = []
          self.data.orderList[1].last_id = 0
        }
        self.setData(self.data)
        self.getAfterSale(self.data.currentId)
      }
    })
    // this.getOrder(willChangeState)
  },

  cancelAfterSale: function(e) {
    // console.info(e.currentTarget.dataset)
    var orderId = e.currentTarget.dataset.orderid
    var item_price_id = e.currentTarget.dataset.itempriceid
    var self = this
    // console.info(orderId)
    wx.showModal({
      content: '确定取消售后申请吗？',
      success: function(res) {
        if (res.confirm) {
          self.changeAfterSale(orderId, 0)
        }
      }
    })
  },

  changeAfterSale: function(orderId, willChangeState) {
    var self = this
    // -1 取消订单 1已支付 3已收货
    server.api(api.changeAfterSale, {
      order_id: orderId,
      after_sale_state: willChangeState,
    }, "post").then(function(res) {
      if (res.text == "更新售后申请成功") {
        // 刷新
        if (self.data.currentId == 0) {
          // 申请售后
          self.data.orderList[0].list = []
          self.data.orderList[0].last_id = 0
        } else if (self.data.currentId == 1) {
          // 售后记录
          self.data.orderList[1].list = []
          self.data.orderList[1].last_id = 0
        }
        self.setData(self.data)
        self.getAfterSale(self.data.currentId)
      } else {
        wx.showModal({
          content: '售后申请取消失败',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              // 刷新
              if (self.data.currentId == 0) {
                // 申请售后
                self.data.orderList[0].list = []
                self.data.orderList[0].last_id = 0
              } else if (self.data.currentId == 1) {
                // 售后记录
                self.data.orderList[1].list = []
                self.data.orderList[1].last_id = 0
              }
              self.setData(self.data)
              self.getAfterSale(self.data.currentId)
            }
          }
        })
      }
    })
  },

  toGoodsDetail: function(e) {
    var data = e.currentTarget.dataset
    // console.info(data)
    app.globalData.orderDetail = this.data.orderList[data.pageid].list[data.orderid]
    wx.navigateTo({
      url: 'afterSaleDetail?isAfterSale=' + data.isaftersale,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getAfterSaleNotice()
    
    if (app.globalData.refreshAfterSale) {
      var orderList = [{
        status: 0, // 申请售后
        last_id: 0, // 上划加载tag
        list: []
      }, {
        status: 1, // 售后记录
        last_id: 0,
        list: []
      }]
      this.setData({
        orderList: orderList
      })
      this.getAfterSale(0)
      app.globalData.refreshAfterSale = false
    }
  },

  getAfterSaleNotice: function() {
    server.api(api.getAfterSaleNotice, {
      user_id: app.globalData.user_id
    }, "post").then(function(res) {
      // console.info(res)
      if (res) {
        if (res.code == 0) {
          wx.showModal({
            title: '拒绝退款',
            content: '商家拒绝了您的退款申请，如需帮助，请在“我的”页面中联系客服解决',
            showCancel: false,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var self = this
    self.setData({
      isReachBottom: true
    })

    this.getAfterSale(this.data.currentId)

    self.data.winHeight = self.data.calc
    self.setData(self.data)

    setTimeout(function() {
      self.data.winHeight = self.data.calc + 10
      self.setData(self.data)
    }, 500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})