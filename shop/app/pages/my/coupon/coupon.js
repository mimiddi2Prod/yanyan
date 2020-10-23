// pages/my/coupon/coupon.js
const util = require('../../../utils/util.js')
var server = require('../../../utils/server.js');
const api = require('../../../config/api.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCardList()
    // let price = Number(options.price)
    // let cardList = app.globalData.cardList
    // cardList = cardList.map(function(e) {
    //   e.begin_time = util.formatTime(new Date(e.begin_time))
    //   e.end_time = util.formatTime(new Date(e.end_time))
    //   if (e.least_cost <= price) {
    //     e.canUseCoupon = true
    //   } else {
    //     e.canUseCoupon = false
    //   }
    //   return e
    // })

    // this.setData({
    //   cardList: cardList
    // })
  },
  getCardList: function () {
    let self = this
    server.api(api.getCard, {
      'openid': app.globalData.openid
    }, 'post').then(function (res) {
      // console.info(res)
      if (res.length > 0) {
        // 去除过期优惠券
        console.info(res)
        res = res.filter(function (item) {
          item.begin_time = util.formatTime(new Date(item.begin_time))
          item.end_time = util.formatTime(new Date(item.end_time))
          // todo pEl0pw3rG7YxyuFNIuJ1hENpgF9k的 || 判断 2020/09/17后才能去掉
          return (new Date(item.end_time).getTime() > new Date().getTime() && new Date(item.begin_time).getTime() < new Date().getTime()) || (item.card_id == "pEl0pw3rG7YxyuFNIuJ1hENpgF9k" && new Date(item.end_time).getTime() > new Date().getTime())
        })
        self.setData({
          cardList: res,
          // selectCard: res[0]
        })
      }
    })
  },
  selectCard: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
    // let data = e.currentTarget.dataset
    // if (data.canuse) {
    //   app.globalData.selectCard = this.data.cardList.filter(function(item) {
    //     return item.id == data.id
    //   })[0]
    //   wx.navigateBack({})
    // } else {
    //   wx.showToast({
    //     title: '不满足条件满减条件',
    //     icon: 'none'
    //   })
    // }
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