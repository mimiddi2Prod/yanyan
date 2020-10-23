// pages/my/afterSale/saleType.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: [{
      image: '/images/clear_input.png',
      name: '仅退款',
      desc: '未收到货（包含未签收）或者拒收包裹',
      url: 'saleDesc',
    },
    //  {
    //   image: '/images/clear_input.png',
    //   name: '退货退款',
    //   desc: '因质量、错发等问题需要退货退款，或因漏发需要补发货',
    //   url: 'saleDesc',
    // }, {
    //   image: '/images/clear_input.png',
    //   name: '换货',
    //   desc: '因尺寸、错发等问题需要换货，或因漏发需要补发货',
    //   url: 'saleDesc',
    // }
    ],

    orderDetail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.info(app.globalData.orderDetail)
    this.setData({
      orderDetail: app.globalData.orderDetail
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})