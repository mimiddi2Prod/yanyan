// pages/my/Logistics.js
const server = require('../../utils/server.js')
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:'',
    logo:'',
    number:'',
    expName:'',
    itemList:[],
    // itemList: [{
    //   // statue: 1,
    //   name: '已签收',
    //   time: "2019-03-12 21:11:00"
    // }, {
    //   // statue: 0,
    //   name: '配送员开始配送，请您准备收货，配送员，xxx，手机号，xxxxxxx',
    //   time: "2019-03-12 21:11:00"
    // }, {
    //   // statue: 0,
    //   name: '货物已分配，等待配送',
    //   time: "2019-03-12 21:11:00"
    // }, {
    //   // statue: 0,
    //   name: '货物已到达【厦门杏林营业部】',
    //   time: "2019-03-12 21:11:00"
    // }, {
    //   // statue: 0,
    //   name: '货物已完成分拣，离开【广州黄埔分拣中心】',
    //   time: "2019-03-12 21:11:00"
    // }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.info(options)
    this.getLogistics(options.logistics_code)
  },

  getLogistics: function(no) {
    let self = this
    server.api(api.getLogistics, {
      no: no,
    }, "post").then(function(res) {
      // console.info(res)
      if(res.msg == "ok"){
        self.setData({
          msg:res.msg,
          itemList:res.result.list,
          logo:res.result.logo,
          number: res.result.number,
          expName: res.result.expName,
        })
      }
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