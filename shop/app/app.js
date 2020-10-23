//app.js
const server = require('/utils/server.js')
const api = require('/config/api.js')
// var Interval = null

var qqmap = require('/utils/qqMap.js')
App({
  onLaunch: function () {
    if (wx.canIUse("getUpdateManager")) {
      let updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate);
      })
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            } else if (res.cancel) {
              return false;
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        wx.hideLoading();
        wx.showModal({
          title: '升级失败',
          content: '新版本下载失败，请检查网络！',
          showCancel: false
        });
      });
    }
    // 手机信息 适配tabbar
    // var self = this
    // wx.getSystemInfo({
    //   success: function (res) {
    //     self.globalData.model = res.model
    //     let model = res.model.substring(0, res.model.indexOf('X')) + 'X'
    //     if (model == "iPhone X") {
    //       self.globalData.isIpx = true
    //     }
    //   }
    // })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var self = this
    wx.login({
      success: function (res) {
        server.api(api.getOpenid, {
          code: res.code
        }, "post").then(function (res) {
          self.globalData.openid = res.openid
          self.globalData.user_id = res.user_id
          if (res.integral) {
            self.globalData.integral = res.integral
          }

          // console.info(res)
          // if (res.phone) {
          //   self.globalData.phone = res.phone
          //   if (res.customer) {
          //     self.globalData.isCustomer = true
          //     self.globalData.point = res.customer.data.point
          //     self.globalData.balance = res.customer.data.balance
          //     self.globalData.discount = res.customer.data.discount
          //     self.globalData.customerUid = res.customer.data.customerUid
          //   }
          // }
          let is_new_customer = res.is_new_customer || false
          self.login(res.openid, is_new_customer)
        })
      }
    })

    // 腾讯地图初始化
    qqmap.Init()

    // wx.getLocation({
    //   type: 'gcj02',
    //   isHighAccuracy: true,
    //   success: function(res) {
    //     console.info(res)
    //     self.globalData.mylatitude = res.latitude
    //     self.globalData.mylongitude = res.longitude
    //   },
    //   fail: function(res) {
    //     // let Interval = setInterval(() => {
    //     //   if (self.globalData.location.length > 0) {
    //     //     self.globalData.mylatitude = self.globalData.location.split(",")[0]
    //     //     self.globalData.mylongitude = self.globalData.location.split(",")[1]
    //     //     clearInterval(Interval)
    //     //   }
    //     // }, 500)
    //   }
    // })

    self.getStore()
  },

  onShow: function () {
    // var self = this
    // // console.info(self.globalData.check_token)
    // if (self.globalData.check_token) {
    //   self.check_token()

    //   // 1分钟检查一次 小程序存活就更新时间
    //   Interval = setInterval(function () {
    //     self.check_token()
    //   }, 60000)
    // }
  },

  onHide: function () {
    // clearInterval(Interval)
  },

  // check_token: function () {
  //   var self = this
  //   let url = api.queueUpdateTimeByToken
  //   wx.request({
  //     url: url,
  //     data: {
  //       token: self.globalData.token
  //     },
  //     method: "post",
  //     success: function (res) {
  //       // console.info(res)
  //       if (res.data.data.code == 0) {
  //         // wx.reLaunch({
  //         //   url: '../blank/blank',
  //         // })
  //         wx.redirectTo({
  //           url: '../blank/blank',
  //         })
  //       }
  //     },
  //   })
  // },

  login: function (openid, is_new_customer) {
    var self = this
    server.api(api.login, {
      op_id: openid,
      is_new_customer: is_new_customer
    }, "post").then(function (res) {
      // console.info(res)
      if (res.length <= 0) {

      } else {
        // console.info(res)
        self.globalData.user_id = res.user_id
        if (res.avatar) {
          self.globalData.userInfo = {}
          self.globalData.userInfo.avatarUrl = res.avatar
          self.globalData.userInfo.nickName = decodeURIComponent(res.nick_name)
        }

        if (res.address.length > 0) {
          // console.info(res.address[0])
          self.globalData.default_address = res.address[0]
          self.globalData.adreslat = res.address[0].adreslat
          self.globalData.adreslng = res.address[0].adreslng

          self.globalData.mylatitude = res.address[0].adreslat
          self.globalData.mylongitude = res.address[0].adreslng
        }
        wx.hideLoading()
      }
    })
  },

  // 获取店铺信息
  getStore: function () {
    var self = this
    server.api(api.getStore, {}, "post").then(function (res) {
      if (res.store && res.qqMapSubkey) {
        // console.info(res)
        self.globalData.start_time = res.store[0].start_time
        self.globalData.end_time = res.store[0].end_time
        self.globalData.server_phone = res.store[0].phone
        self.globalData.delivery_fee = res.store[0].delivery_fee
        self.globalData.free_delivery_fee = res.store[0].free_delivery_fee
        self.globalData.shopLocation = res.store[0].location
        self.globalData.shopDistance = res.store[0].distance
        // self.globalData.qqMapSubkey = res.qqMapSubkey

        // if (self.globalData.mylongitude.length <= 0 || self.globalData.mylatitude.length <= 0) {
        //   self.globalData.mylatitude = self.globalData.shopLocation.split(",")[0]
        //   self.globalData.mylongitude = self.globalData.shopLocation.split(",")[1]
        // }
      }
    })
  },


  globalData: {
    // 排队等待
    // check_token: false,
    // userInfo: null,

    // 手机型号
    // model: null,
    // isIpx: false,
    openid: '',
    user_id: '',
    integral: 0,
    userInfo: null,
    default_address: null,
    subCategory: {},
    refreshOrder: false,
    refreshCart: false,
    refreshAfterSale: false,

    orderList: [],
    orderDetail: [],
    payInfo: {},

    selectAddress: null,

    phone: '',
    // 银豹会员信息
    // customerUid: '',
    // point: 0,
    // balance: 0,
    // discount: 0,
    // isCustomer: false

    start_time: '',
    end_time: '',
    server_phone: '',
    delivery_fee: '',
    free_delivery_fee: '',
    shopLocation: '',
    shopDistance: '', // 距离 米
    // qqMapSubkey: '',

    mylatitude: '',
    mylongitude: '',

    adreslat: '',
    adreslng: '',
    adres: '',

    catalogid: '', // 导航首页跳转需要

    panicBuying: '',

    // 优惠券相关
    cardList: [],
    selectCard: {},

    current_panicBuying: null
  }
})