// pages/share/share.js
const server = require('../../utils/server.js')
const api = require('../../config/api.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let sys = wx.getSystemInfoSync()
    // console.info(sys)
    // 图片长宽 974 x 1402pingmu
    // let wid, hei = sys.safeArea.height * 2 * 7 / 10
    // console.info(1402 / 974, hei / 750)
    // if ((1402 / 974) < (hei / 750)) {
    //   // hei = 1080
    //   wid = hei / 750 * 974
    // } else {
    //   wid = 750
    // }
    // this.setData({
    //   ImgWidth: wid
    // })
  },
  // 诗雷对线一周
  cardWatcher: function (openid, cardList, cardListCallback, tag) {
    server.api(api.cardWatcher, {
      'openid': openid,
      'cardList': cardList,
      'cardListCallback': cardListCallback,
      'tag': tag
    }, 'post')
  },
  getShareCouponCard: function () {
    let self = this
    server.api(api.getCouponCard, {
      'openid': app.globalData.openid,
      'type': 'share'
    }, 'post').then(function (res) {
      // console.info(res)
      if (!res.cardList || !res.cardList.length) {
        wx.showModal({
          title: '提示',
          content: '当前可领红包个数为0',
          showCancel: false
        })
        return
      }
      wx.addCard({
        cardList: res.cardList,
        success: function (e) {
          // console.info(e)
          // 诗雷对线一周
          self.cardWatcher(app.globalData.openid, res.cardList, e, 'success')
          if (e.cardList.length) {
            e.cardList = e.cardList.filter(val => {
              return val.code && val.code != "null"
            })
            self.saveCard(JSON.stringify(e))
          }
        },
        complete: function (e) {
          // console.info(e)
          // 诗雷对线一周
          self.cardWatcher(app.globalData.openid, res.cardList, e, 'complete')
        }
      })
    })
  },
  saveCard: function (data) {
    this.cardWatcher(app.globalData.openid, JSON.parse(data), [], "save")
    server.api(api.saveCard, {
      'openid': app.globalData.openid,
      'cardList': data
    }, 'post').then(function (res) {
      // console.info(res)
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
    return {
      title: '岩岩到家线上超市 又好又快',
      imageUrl: "/images/to_share_img.png",
      path: '/pages/index/index?share_id=' + app.globalData.user_id
    }
  }
})