// pages/my/order/orderDetail.js
var util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {},
    total_goods_price: '',
    total_price: '',

    isAfterSale: false,
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
    // console.info(app.globalData.orderDetail)
    const orderDetail = app.globalData.orderDetail
// console.info(orderDetail)
    this.setData({
      orderDetail: orderDetail
    })
    if (orderDetail.select_card_id){
      this.data.orderDetail.single_price = Number(this.data.orderDetail.discount_price).toFixed(2)
    }else{
      this.data.orderDetail.single_price = Number(this.data.orderDetail.single_price).toFixed(2)
    }
   
    // this.data.orderDetail.postage = Number(this.data.orderDetail.postage).toFixed(2)
    this.data.orderDetail.create_time = util.formatTime(new Date(this.data.orderDetail.create_time))
    if(orderDetail.select_card_id){
      this.data.total_goods_price = Number((orderDetail.discount_price * orderDetail.number)).toFixed(2)
      // this.data.total_price = (Number(orderDetail.discount_price * orderDetail.number) + Number(orderDetail.postage)).toFixed(2)
      this.data.total_price = (Number(orderDetail.discount_price * orderDetail.number)).toFixed(2)
    }else{
      this.data.total_goods_price = Number((orderDetail.single_price * orderDetail.number)).toFixed(2)
      // this.data.total_price = (Number(orderDetail.single_price * orderDetail.number) + Number(orderDetail.postage)).toFixed(2)
      this.data.total_price = (Number(orderDetail.single_price * orderDetail.number)).toFixed(2)
    }
    
    this.setData(this.data)
  },

  showImg: function (e) {
    let urls = []
    urls.push(e.currentTarget.dataset.image)
    wx.previewImage({
      current: e.currentTarget.dataset.image, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
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