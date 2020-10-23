// pages/my/customer.js
const server = require('../../utils/server.js')
const api = require('../../config/api.js');
const util = require('../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCustomer: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isCustomer: app.globalData.isCustomer
    })
  },

  getPhoneNumber: function (e) {
    let self = this
    // console.info(e)
    let errMsg = e.detail.errMsg
    if (errMsg == "getPhoneNumber:ok") {
      if (e.detail.encryptedData && e.detail.iv) {
        let self = this
        let data = {}
        data.encryptedData = e.detail.encryptedData
        data.iv = e.detail.iv
        data.openid = app.globalData.openid

        server.api(api.getUserPhone, data, "post").then(function (res) {
          // console.info(res)
          if (res.code == 0) {
            app.globalData.point = res.data.point //积分
            app.globalData.balance = res.data.balance //余额
            app.globalData.discount = res.data.discount //折扣 100无折扣 70表示7折
            app.globalData.isCustomer = true
            app.globalData.customerUid = res.data.customerUid
            self.setData({
              isCustomer: app.globalData.isCustomer
            })

            wx.navigateBack({})
          }
        })
      }
    } else {
      wx.showModal({
        content: '获取手机号失败',
        showCancel: false
      })
    }
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