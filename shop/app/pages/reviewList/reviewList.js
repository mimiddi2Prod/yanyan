// pages/reviewList/reviewList.js
var app = getApp();
var server = require('../../utils/server.js');
var api = require('../../config/api.js');
var util = require('../../utils/util.js')

Page({
  data: {
    // comments: [],
    // allCommentList: [],
    // picCommentList: [],
    goodsId: 0,
    reviewList: [],
    item_last_id: 0,
    // showType: 0,
    // allCount: 0,
    // hasPicCount: 0,
    // allPage: 1,
    // picPage: 1,
    // size: 20
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      goodsId: options.goodsId,
    });
    this.getReview()
  },

  previewImage: function (e) {
    let index = e.currentTarget.dataset.index,
      list = e.currentTarget.dataset.list
    wx.previewImage({
      urls: list,
      current: list[index]
    })
  },

  getReview: function() {
    var self = this
    server.api(api.getReview, {
      item_last_id: this.data.item_last_id,
      goods_id: this.data.goodsId
    }, "post").then(function(res) {
      // console.info(res)
      if (res.length > 0) {
        res = res.map(function(obj) {
          obj.user_name = decodeURIComponent(obj.user_name)
          obj.text = decodeURIComponent(obj.text)
          obj.create_time = util.formatTime(new Date(obj.create_time))
          obj.imageR = []
          for (let i in obj.image) {
            obj.imageR[i] = obj.image[i] + "?imageView2/0/w/300/h/300"
          }
          return obj
        })
        // console.info(res)
        var item_last_id = self.data.item_last_id + 1
        var reviewList = self.data.reviewList.concat(res)
        self.setData({
          item_last_id: item_last_id,
          reviewList: reviewList
        })
      }
    })
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
  // switchTab: function () {
  //   this.setData({
  //     showType: this.data.showType == 1 ? 0 : 1
  //   });

  //   this.getCommentList();
  // },
  onReachBottom: function() {
    this.getReview()
    // console.log('onPullDownRefresh');
    // if (this.data.showType == 0) {

    //   if (this.data.allCount / this.data.size < this.data.allPage) {
    //     return false;
    //   }

    //   this.setData({
    //     'allPage': this.data.allPage + 1
    //   });
    // } else {
    //   if (this.data.hasPicCount / this.data.size < this.data.picPage) {
    //     return false;
    //   }

    //   this.setData({
    //     'picPage': this.data.picPage + 1
    //   });
    // }



    // this.getCommentList();
  }
})