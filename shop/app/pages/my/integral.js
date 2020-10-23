// pages/my/integral.js
var server = require('../../utils/server.js');
var api = require('../../config/api.js');

const app = getApp()
Page({
  data: {
    waterfallGoods: [],
    integral: 0,
    item_last_id: 0, //瀑布流加载id
    warmText: '',
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      integral: app.globalData.point
    });
    this.waterfall()
  },

  waterfall: function() {
    var self = this
    server.api(api.waterfall, {
      item_last_id: self.data.item_last_id,
      type: 1,
    }, "post").then(function(res) {
      // console.info(res)
      if (res.waterfallList.length > 0) {
        self.data.waterfallGoods.push({})
      } else {
        self.data.warmText = "没有更多数据了~"
      }
      if (res.waterfallList.length > 0) {
        self.data.item_last_id++
          self.data.waterfallGoods[self.data.waterfallGoods.length - 1].waterfallList = res.waterfallList
      }
      self.setData(self.data)
    })
  },

  checkIntegral: function(e) {
    let integral = e.currentTarget.dataset.integral
    if (integral > this.data.integral) {
      // console.info(this.data.integral)
      wx.showToast({
        title: '购买该商品所需积分不足',
        icon: 'none',
      })
    } else {
      wx.navigateTo({
        url: '../goods/goods?id=' + e.currentTarget.dataset.id,
      })
    }
  },

  onReachBottom: function() {
    // 页面上划加载
    this.waterfall()
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
})