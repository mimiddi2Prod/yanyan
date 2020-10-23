// pages/my/my.js
const server = require('../../utils/server.js')
const api = require('../../config/api.js')

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    itemList: [{
        image: '/images/dingdan-li.png',
        name: '我的订单',
        url: 'order/order',
      }, {
        image: '/images/dingwei.png',
        name: '地址管理',
        url: 'address',
      }, 
      // {
      //   image: '/images/dianpu.png',
      //   name: '积分商城',
      //   url: 'integral',
      // }, 
      {
        image: '/images/kuaidi.png',
        name: '售后服务',
        url: 'afterSale/afterSale',
      },
      {
        image: '/images/tongzhi.png',
        name: '联系客服',
        url: '../service/service',
      },
      {
        image: '/images/coupon.png',
        name: '红包卡券',
        url: 'coupon/coupon',
      },
      //  {
      //   image: '/images/duihua.png',
      //   name: '不浪费商城用户协议',
      //   url: 'userAgreement',
      // }
      // , {
      //   image: '/images/tongzhi.png',
      //   name: '消息通知',
      //   url: 'inform',
      // }
    ],
    integral: 0,

    // 银豹
    // point: 0,
    // balance: 0,
    // discount: 0,
    // isCustomer: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var self = this
    // if (app.globalData.userInfo) {
    //   self.setData({
    //     userInfo: app.globalData.userInfo
    //   })
    // }
    // console.info(this.data.userInfo)
    // wx.getStorage({
    //   key: 'userInfo',
    //   success: function(res) {
    //     console.info('---userInfo getStorage success---')
    //     if (res.errMsg === "getStorage:ok") {
    //       console.info(res)
    //       self.setData({
    //         userInfo: res.data
    //       })
    //     }
    //   },
    // fail: function(res) {
    //   console.info('---userInfo getStorage fail and login---')
    //   self.login().then(function(res) {
    //     console.info(res)
    //     if(res == "找不到该用户"){

    //     }else{
    //       console.info(res)
    //       let userInfo = {}
    //       userInfo.nickName = decodeURIComponent(res.nick_name)
    //       userInfo.avatarUrl = res.avatar
    //       self.setData({
    //         userInfo: userInfo
    //       })
    //       wx.setStorage({
    //         key: 'userInfo',
    //         data: userInfo
    //       })
    //     }
    //   })
    // }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getUserInfo: function(e) {
    var self = this
    // console.info(e.detail.userInfo)
    if (e.detail.errMsg === "getUserInfo:ok") {
      var avatar = e.detail.userInfo.avatarUrl,
        nick_name = encodeURIComponent(e.detail.userInfo.nickName.replace(/%/g, '%25')),
        iv = e.detail.iv,
        encryptedData = e.detail.encryptedData

      this.login().then(function(res) {
        // console.info(res)
        // if (res.length <= 0) {
        if (!res.avatar) {
          // console.info(avatar)
          // console.info(nick_name)
          self.register(avatar, nick_name, iv, encryptedData).then(function(res) {
            // console.info(res)
            if (res.user_id) {
              // console.info(res)
              app.globalData.user_id = res.user_id
              // console.info('---注册成功---')
            }
          })
        }
      })
      wx.showToast({
        title: '登录成功',
      })
      // console.info(e.detail.userInfo)
      this.setData({
        userInfo: e.detail.userInfo
      })
      app.globalData.userInfo = e.detail.userInfo

      // wx.setStorage({
      //   key: 'userInfo',
      //   data: e.detail.userInfo
      // })
    } else {
      wx.showModal({
        title: '登录失败',
        content: '授权登录，才能获取更多服务',
      })
    }
  },

  login: function() {
    var self = this
    return new Promise(function(resolve, reject) {
      // wx.getStorage({
      //   key: 'openid',
      // success: function(res) {
      // const openid = res.data

      // server.api(api.login, {
      //   op_id: app.globalData.openid
      // }, "post").then(function(res) {
      //   console.info(res)
      //   resolve(res)
      // })

      wx.request({
        url: api.login,
        data: {
          op_id: app.globalData.openid
        },
        method: "post",
        success: function(res) {
          // console.info(res)
          // if (res.data.res.code == 11) {
          resolve(res.data.data)
          // }
        },
      })
      // },
      // })
    })
  },

  register: function(avatar, nick_name, iv, encryptedData) {
    var self = this
    return new Promise(function(resolve, reject) {
      // wx.getStorage({
      //   key: 'openid',
      // success: function(res) {
      // const openid = res.data
      server.api(api.register, {
        op_id: app.globalData.openid,
        type: 0,
        avatar: avatar,
        nick_name: nick_name,
        iv: iv,
        encryptedData: encryptedData
      }, "post").then(function(res) {
        resolve(res)
      })
      // },
      // })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getIntegral()
    let self = this
    // console.info(app.globalData)
    let interval = setInterval(function () {
      if (app.globalData.userInfo) {
        clearInterval(interval)
        self.setData({
          userInfo: app.globalData.userInfo,
          integral: app.globalData.integral,
          user_id: app.globalData.user_id
          // point: app.globalData.point,
          // balance: app.globalData.balance,
          // discount: app.globalData.discount,
          // isCustomer: app.globalData.isCustomer
        })
      }
    }, 500)
  },

  getIntegral: function() {
    let self = this
    server.api(api.getIntegral, {
      user_id: app.globalData.user_id,
    }, "post").then(function(res) {
      if (res.length > 0) {
        self.setData({
          integral: res[0].integral
        })
        app.globalData.integral = res[0].integral
      }
    })
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