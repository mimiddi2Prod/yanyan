// pages/my/order/orderDetail.js
var server = require('../../../utils/server.js');
var util = require('../../../utils/util.js')
const api = require('../../../config/api.js')
const pay = require('../../../utils/pay.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {},
    // total_goods_price: '',
    // total_price: '',

    isAfterSale: false,

    showPayMethodDialog: false,

    showModal: false,
    image: "http://yanyanqiniu.youyueworld.com/20200628092441.png?imageView2/2/w/800/h/800",

    winTop: "",
    isNewCustomer: false,
    flag: 0
  },

  showModal: function () {
    wx.navigateBack({

    })
    self.setData({
      showModal: false
    })
  },

  // 获取领取列表
  getCouponCard: function () {
    let self = this
    server.api(api.getCouponCard, {
      'openid': app.globalData.openid,
      'type': 'newCustomer',
      'isNewCustomer': this.data.isNewCustomer
    }, 'post').then(function (res) {
      // console.info(res)
      wx.addCard({
        cardList: res.cardList,
        success: function (e) {
          // console.info(e)
          self.setData({
            showModal: false
          })
          if (e.cardList.length) {
            e.cardList = e.cardList.filter(val => {
              return val.code && val.code != "null"
            })
            self.saveCard(JSON.stringify(e))
          }
          // self.saveCard(JSON.stringify(e))
        },
        complete: function (e) {
          // console.info(e)
        }
      })
    })
  },

  saveCard: function (data) {
    server.api(api.saveCard, {
      'openid': app.globalData.openid,
      'cardList': data
    }, 'post').then(function (res) {
      // console.info(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.isAfterSale) {
      var isAfterSale = (options.isAfterSale === 'true')
      this.setData({
        isAfterSale: isAfterSale
      })
    }
    const orderDetail = app.globalData.orderDetail
    orderDetail.create_time = util.formatTime(new Date(orderDetail.create_time))
    orderDetail.total = 0
    if (orderDetail.select_card_id) {
      let cash = typeof orderDetail.card.info.cash == 'string' ? JSON.parse(orderDetail.card.info.cash) : orderDetail.card.info.cash
      orderDetail.card.info.cash = cash
      // if (cash)
      // console.info(cash)
      let checkCard = this.checkCard(cash)
      // console.info(orderDetail, checkCard)
      if (checkCard) {
        // console.info(orderDetail.total_price, cash.reduce_cost, orderDetail.postage)
        orderDetail.pay_price = orderDetail.total_price - (cash.reduce_cost / 100)
      }

    } else {
      orderDetail.pay_price = orderDetail.total_price
    }

    // if(){
    // console.info(orderDetail.pay_price)
    // console.info(orderDetail.postage)
    orderDetail.pay_price = (orderDetail.pay_price + orderDetail.postage).toFixed(2)
    // console.info(orderDetail.pay_price)
    // }
    this.setData({
      orderDetail: orderDetail
    })
    if (this.data.orderDetail.payInterval) {
      this.payInterval()
    }
    // this.data.orderDetail.single_price = Number(this.data.orderDetail.single_price).toFixed(2)
    // this.data.orderDetail.postage = Number(this.data.orderDetail.postage).toFixed(2)
    // this.data.total_goods_price = Number((orderDetail.single_price * orderDetail.number)).toFixed(2)
    // this.data.total_price = (Number(orderDetail.single_price * orderDetail.number) + Number(orderDetail.postage)).toFixed(2)
    // this.setData(this.data)

    this.setWinHeight()
  },

  setWinHeight: function () {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        self.setData(self.data)
        self.setData({
          winTop: (calc - 882) / 2,
          // winCartHeightInit: calc - 170,
          // winWidth: clientWidth
        });
      }
    });
  },

  checkCard: function (cash) {
    let current_time = new Date().getTime()
    let begin_time = '',
      end_time = ''
    if (cash.base_info.date_info.type == "DATE_TYPE_FIX_TIME_RANGE") {
      begin_time = cash.base_info.date_info.begin_timestamp * 1000
      end_time = cash.base_info.date_info.end_timestamp * 1000
    } else if (cash.base_info.date_info.type == "DATE_TYPE_FIX_TERM") {
      begin_time = cash.base_info.id == "pEl0pw3rG7YxyuFNIuJ1hENpgF9k" ? current_time : current_time + (cash.base_info.date_info.fixed_begin_term * 24 * 60 * 60 * 1000)
      end_time = begin_time + (cash.base_info.date_info.fixed_term * 24 * 60 * 60 * 1000)
    }
    if (current_time >= begin_time && current_time <= end_time) {
      return true
    }
  },

  payInterval: function () {
    const self = this
    var list = this.data.orderDetail
    var currentTime = new Date().getTime()
    var createTime = new Date(list.create_time).getTime()
    var oneHours = 60 * 60 * 1000
    var time = createTime + oneHours - currentTime
    if (time / oneHours < 1) {
      self.data.orderDetail.interval = setInterval(() => {
        time = time - 1000;
        if (time < 0) {
          clearInterval(self.data.orderDetail.interval)
          self.data.orderDetail.payInterval = ''
          self.setData(self.data)
        } else {
          self.data.orderDetail.payInterval = util.formatTime(new Date(time)).substring(14, 19)
          self.setData(self.data)
        }
      }, 1000)
    }
  },

  showImg: function (e) {
    let urls = []
    urls.push(e.currentTarget.dataset.image)
    wx.previewImage({
      current: e.currentTarget.dataset.image, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  toPayOrder: function (e) {
    // var self = this
    // self.data.orderId = e.currentTarget.dataset.orderid
    // self.data.price = e.currentTarget.dataset.price
    // self.data.integrlprice = e.currentTarget.dataset.integrlprice
    this.setData({
      showPayMethodDialog: true
    })
  },

  payDialog: function () {
    this.setData({
      showPayMethodDialog: false
    })
  },

  checkStock: function (e) {
    let payMethod = e.currentTarget.dataset.pay // 0微信支付 1余额支付
    let self = this
    // 余额支付的话 先检查是否有绑定会员卡/余额是否足够
    if (payMethod == 1) {
      if (Number(this.data.orderDetail.pay_price) > app.globalData.integral) {
        wx.showModal({
          title: '支付失败',
          content: '积分不足',
          showCancel: false
        })
        return
      }
    }

    wx.showLoading({
      title: '请稍后...',
      mask: true
    })

    let checkOrderData = {
      user_id: app.globalData.user_id,
      order: this.data.orderDetail.goodsList
    }
    server.api(api.checkOrderStock, checkOrderData, "post").then(function (res) {
      if (res.code == 0) {
        if (res.canPay == 0) {
          if (payMethod == 0) {
            self.wxPay()
          } else if (payMethod == 1) {
            self.balancePay()
          }
        } else {
          let shortageName = res.shortageList.map(function (eData) {
            return eData.goodsname + 'x' + eData.stock
          }).join(',')
          wx.hideLoading()
          wx.showModal({
            title: '支付失败',
            content: '剩余 ' + shortageName + ' 库存不足，请重新选择商品',
            showCancel: false
          })
        }
      } else {
        wx.showModal({
          title: '',
          showCancel: false
        })
      }
    })
  },

  wxPay: function () {
    var price = Number(this.data.orderDetail.pay_price)
    let self = this,
      data = {}

    data.tradeId = this.data.orderDetail.tradeId
    // 拉起支付
    self.setData({
      showPayMethodDialog: false
    })
    pay.pay(api.payfeeContinue, price, data, "post").then(function (res) {
      // console.info(res)
      wx.hideLoading()
      let tradeId = res
      self.data.orderDetail.tradeId = tradeId
      self.setData(self.data)
      // app.globalData.orderDetail = self.data.orderDetail
      app.globalData.refreshOrder = true
      // self.changeOrderState(orderId, 1, tradeId)
      // self.changeOrderState(tradeId, 1, 0)
      // 取消待发货后
      self.changeOrderState(tradeId, 2, 0)
      // 判断是否首单
      // self.checkNewCustomer()
    }).catch(function (res) {
      wx.hideLoading()
      // console.info(res)
      let tradeId = res
      self.data.orderDetail.tradeId = tradeId
      self.setData(self.data)
      // app.globalData.orderDetail = self.data.orderDetail
      app.globalData.refreshOrder = true
      // 支付失败
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
    })
  },

  balancePay: function () {
    var price = Number(this.data.orderDetail.pay_price)
    let self = this,
      data = {}
    let tradeId = this.data.orderDetail.tradeId
    // 拉起支付
    self.setData({
      showPayMethodDialog: false
    })
    // console.info(self.data.orderDetail)
    // let integral = 0
    if (app.globalData.integral >= price) {
      // self.changeOrderState(tradeId, 1, 1)
      // 取消待发货后
      self.changeOrderState(tradeId, 2, 1)
      // 去除余额支付积分 ver.1.0.18
      let dataI = {
        // integral: (-price) + Number((price / 100).toFixed(2)),
        // integral: (-price) + Number((price / 20).toFixed(2)),
        integral: -price,
        user_id: app.globalData.user_id
      }
      server.api(api.updateIntegral, dataI, "post").then(function (res) {

      })

      let trid = {
        tradeId: tradeId
      }
      server.api(api.ylyPrintOrder, trid, "post").then(function (res) {

      })
      app.globalData.refreshOrder = true
      // 判断是否首单
      // self.checkNewCustomer()
    } else {
      wx.showModal({
        title: '支付失败',
        content: '积分不足',
        showCancel: false
      })
      return
    }
  },

  checkNewCustomer: function () {
    let self = this
    server.api(api.checkNewCustomer, {
      'openid': app.globalData.openid,
    }, 'post').then(function (res) {
      if (res.isNewCustomer) {
        // 获取用户首次下单优惠券
        self.data.orderDetail.state = 1
        clearInterval(self.data.orderDetail.interval)
        self.data.orderDetail.payInterval = ''
        self.setData(self.data)
        self.setData({
          showModal: true,
          isNewCustomer: true
        })
      }
      self.setData({
        flag: self.data.flag + 1
      })
      // else {
      //   wx.navigateBack({

      //   })
      // }
    })
  },

  changeOrderState: function (tradeId, willChangeState, payState) {
    wx.hideLoading()
    var self = this
    // -1 取消订单 1已支付 3已收货
    server.api(api.changeOrderState, {
      trade_id: tradeId,
      state: willChangeState,
      pay_state: payState
    }, "post").then(function (res) {
      self.checkNewCustomer()
      // if (willChangeState == 2) {
      self.checkConsumptionToGetCard()
      self.checkHaveCard()
      // } else {
      //   wx.navigateBack({})
      // }
      // wx.navigateBack({

      // })
    })
  },
  // 检查是否有卡券 没有返回
  checkHaveCard() {
    let self = this
    let Interval = setInterval(() => {
      if (self.data.flag == 2) {
        clearInterval(Interval)
        if (!self.data.showModal) {
          wx.navigateBack({

          })
        }
      }
    }, 1000)
  },

  // 判断是否设置了消费奖励优惠券
  checkConsumptionToGetCard: function () {
    let self = this
    server.api(api.checkConsumptionToGetCard, {
      'openid': app.globalData.openid,
    }, 'post').then(function (res) {
      if (res.haveConsumptionCard) {
        self.setData({
          showModal: true
        })
      }
      self.setData({
        flag: self.data.flag + 1
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})