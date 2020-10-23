// pages/brandDetail/brandDetail.js
const server = require('../../utils/server.js')
const api = require('../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand_id: '',
    brand_name: '',
    brand_img: '',
    desc: '',
    // goodsList: [],
    goods: [],

    last_id: 0,
    warmText: '',

    canPullData: true,

    shareImg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.info(options)
    this.setData({
      brand_id: options.id,
      // brand_name: options.brandName,
      shareImg: options.brandImg,
      brand_img: options.brandImg + "?imageView2/2/w/800/h/800",
      // desc: options.desc
    })
    this.getGoodsList();
  },

  getGoodsList: function() {
    // todo 分批次加载
    var self = this
    server.api(api.goodsList, {
      brandId: this.data.brand_id,
      last_id: this.data.last_id
    }, "post").then(function(res) {
      // console.info(res)
      if (res.length <= 0) {
        self.data.warmText = "没有更多数据了~"
      } else {
        res = res.map(function(eData) {
          eData.image[0] = eData.image[0] + "?imageView2/2/w/300/h/300"
          return eData
        })
        self.data.last_id++
          // self.data.goodsList = self.data.goodsList.concat(res)
          // for(let i in res){
          self.data.goods.push(res)
        // }
      }

      // self.setData({
      //   goodsList: res
      // })
      self.data.canPullData = true
      self.setData(self.data)
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
    if (this.data.canPullData) {
      this.setData({
        canPullData: false
      })
      this.getGoodsList()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      // title: '',
      // 分享我的openid
      path: 'pages/brandDetail/brandDetail?brandImg=' + this.data.shareImg + '&id=' + this.data.brand_id,
      success: function() {
        // wx.navigateBack({})
      }
    }
  }
})