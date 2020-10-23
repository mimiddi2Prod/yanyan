// pages/payResult/payResult.js
const app = getApp()
var server = require('../../utils/server.js');
// const pay = require('../../utils/pay.js')
const api = require('../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payInfo: {},
    showModal: false,
    image: "http://yanyanqiniu.youyueworld.com/20200628092441.png?imageView2/2/w/800/h/800",
    isNewCustomer: false
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setWinHeight()
    // console.info(JSON.stringify(app.globalData.payInfo))
    // app.globalData.payInfo = {
    //   "address": {
    //     "full_region": "福建省福州市鼓楼区",
    //     "address": "杨桥西路 23号",
    //     "isDefault": true,
    //     "id": 1,
    //     "name": "汪洋",
    //     "mobile": "13022222222"
    //   },
    //   "state": 0,
    //   "actualPrice": "65.00"
    // }
    this.setData({
      payInfo: app.globalData.payInfo
    })
    // console.info(options)
    // console.info(app.globalData.payInfo)
    this.getIntegral()

    // 判断是否首单
    this.checkNewCustomer()
    // 判断是否设置了消费奖励优惠券
    if (this.data.payInfo.state != 0) {
      this.checkConsumptionToGetCard()
    }
  },

  getIntegral: function () {
    let self = this
    server.api(api.getIntegral, {
      user_id: app.globalData.user_id,
    }, "post").then(function (res) {
      if (res.length > 0) {
        self.setData({
          integral: res[0].integral
        })
        app.globalData.integral = res[0].integral
      }
    })
  },

  checkNewCustomer: function () {
    let self = this
    server.api(api.checkNewCustomer, {
      'openid': app.globalData.openid,
    }, 'post').then(function (res) {
      if (res.isNewCustomer) {
        // 获取用户首次下单优惠券
        self.setData({
          showModal: true,
          isNewCustomer: true
        })
      }
    })
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
    })
  },

  showModal: function () {
    this.setData({
      showModal: false
    })
  },

  // 获取领取列表
  getCouponCard: function () {
    let self = this
    server.api(api.getCouponCard, {
      'openid': app.globalData.openid,
      'type': 'consumption',
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
          // self.saveCard(JSON.stringify(e))
          if(e.cardList.length){
            e.cardList = e.cardList.filter(val=>{
              return val.code && val.code != "null"
            })
            self.saveCard(JSON.stringify(e))
          }
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

  // rePay: function() {
  //   // 拉起支付
  //   pay.pay(api.payfee, app.globalData.payInfo.actualPrice, "post").then(function(res) {
  //     console.info(res)
  //   }).catch(function(res){
  //     console.info(res)
  //   })
  // },

  // addOrderByState: function (state, tradeId) {
  //   console.info(this.data.checkedGoodsList)
  //   var orderList = this.data.checkedGoodsList
  //   var address = this.data.checkedAddress
  //   var self = this
  //   var submitNum = 0
  //   console.info(address)
  //   for (var i in orderList) {
  //     var data = {}
  //     data.user_id = app.globalData.user_id
  //     data.item_id = orderList[i].item_id
  //     data.param_id_1 = orderList[i].item_param_id_1
  //     data.param_id_2 = orderList[i].item_param_id_2
  //     data.number = orderList[i].number
  //     data.single_price = orderList[i].price
  //     data.postage = 0
  //     data.state = state
  //     data.address_text = address.full_region + address.address
  //     data.tel = address.mobile
  //     data.receiver = address.name
  //     data.tradeId = tradeId
  //     server.api(api.submitOrder, data, "post").then(function (res) {
  //       console.info(res)
  //       if (res.text == "添加订单成功") {
  //         submitNum++
  //         if (submitNum == orderList.length) {
  //           // 跳转显示订单状态
  //           app.globalData.payInfo.address = address
  //           app.globalData.payInfo.state = state
  //           app.globalData.payInfo.actualPrice = self.data.actualPrice

  //           wx.redirectTo({
  //             url: '../../payResult/payResult',
  //           })
  //         }
  //       } else {
  //         wx.showModal({
  //           title: '下单失败',
  //           showCancel: false,
  //         })
  //       }
  //     })
  //   }
  // },

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