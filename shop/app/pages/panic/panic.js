// pages/panic/panic.js
const server = require('../../utils/server.js')
const api = require('../../config/api.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false,
    panicBuying: [],
    current_panicBuying: {},
    tag: 0,
    appear: false
  },

  scroll: function (e) {
    wx.pageScrollTo({
      scrollTop: 143,
      duration: 0
    })
    this.setData({
      tag: e.currentTarget.dataset.index
    })
  },
  getPanic: function () {
    var self = this
    server.api(api.getPanic, {
      item_last_id: 0,
      topic_last_id: 0,
      type: 0,
    }, "post").then(function (res) {
      // console.info(res)
      // 抢购
      if (res.panicBuying.length > 0) {
        for (let i in res.panicBuying) {
          res.panicBuying[i].list = res.panicBuying[i].list.map(function (eData) {
            eData.image[0] = eData.image[0] + '?imageView2/2/w/400/h/800'
            return eData
          })
        }
        app.globalData.panicBuying = res.panicBuying
      }
      self.setData({
        panicBuying: app.globalData.panicBuying
      })
      self.panic()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      panicBuying: app.globalData.panicBuying
    })
    if (this.data.panicBuying == '') {
      this.getPanic()
    } else {
      this.panic()
    }

    // tab悬浮置顶
    this._observer = wx.createIntersectionObserver(this)
    // this._observer
    //   .relativeTo('.pg')
    //   .observe('.top-img', (res) => {
    //     console.log(res);
    //     this.setData({
    //       appear: res.intersectionRatio <= 0
    //     })
    //   })
    this._observer.relativeToViewport({
      bottom: 0
    }).observe('.top-img', (res) => {
      // console.info(res)
      this.setData({
        appear: res.intersectionRatio <= 0
      })
    })
  },

  onUnload: function () {
    if (this._observer) this._observer.disconnect()
  },

  panic: function () {
    function checkTime(i) {
      if (i < 10) { i = "0" + i }
      return i
    }
    let self = this
    let current_time = new Date()
    let date = current_time.getFullYear() + '/' + (current_time.getMonth() + 1) + '/' + current_time.getDate() + ' '
    let hms = checkTime(current_time.getHours()) + ':' + checkTime(current_time.getMinutes()) + ':' + checkTime(current_time.getSeconds())
    for (let i in self.data.panicBuying) {
      if (self.data.panicBuying[i].end_time < hms) {
        self.data.panicBuying[i].isPanic = false
      } else {
        self.data.panicBuying[i].isPanic = true
      }
    }
    // 去掉过期抢购
    // self.data.panicBuying.shift()
    self.data.panicBuying = self.data.panicBuying.filter(function (item) {
      return item.isPanic
    })
    self.setData(self.data)

    for (let i in self.data.panicBuying) {
      if (self.data.panicBuying[i].start_time <= hms && self.data.panicBuying[i].end_time > hms) {
        // self.data.current_panicBuying = self.data.panicBuying[i]

        var currentTime = new Date().getTime()
        var endTime = new Date(date + self.data.panicBuying[i].end_time).getTime()
        var time = endTime - currentTime
        let h = '00',
          m = '00',
          s = '00',
          remainder
        self.data.panicBuying[i].interval = setInterval(() => {
          if (time <= 0) {
            clearInterval(self.data.panicBuying[i].interval)
            self.data.panicBuying[i].interval = ''
            self.data.panicBuying[i].isPanic = false
            // 去掉过期抢购
            self.data.panicBuying.shift()
            // self.data.panicBuying[i] = {}
            self.setData(self.data)
            self.panic()
          } else {
            time = time - 1000
            let ex = (time / 1000) >> 0
            h = (ex / 3600) >> 0
            h = h < 10 ? '0' + h : h
            remainder = ex % 3600
            if (remainder > 0) {
              m = (remainder / 60) >> 0
              m = m < 10 ? '0' + m : m
              remainder = remainder % 60
              if (remainder > 0) {
                s = remainder
                s = s < 10 ? '0' + s : s
              }
            }
            self.data.panicBuying[i].time = h + ':' + m + ':' + s
            self.setData(self.data)
          }
        }, 1000)
        break
      }
    }
  },

  addToCart: function (e) {
    var self = this;
    // 判断是否注册过
    // 如果没有 需要跳转 写有登录按钮的页面去登录
    if (app.globalData.user_id == '' || !app.globalData.userInfo) {
      this.loginDialog()
      return
    }

    //添加到购物车
    server.api(api.addCart, {
      user_id: app.globalData.user_id,
      item_id: e.currentTarget.dataset.id,
      number: 1
    }, "POST").then(function (res) {
      // console.info(res)
      // return
      if (res.text == "添加成功") {
        wx.showToast({
          title: '添加成功',
          icon: "none",
        });
        app.globalData.refreshCart = true
        // self.setData({
        //   openAttr: !self.data.openAttr
        // });
        self.getCartList()
      } else if (res.text == "添加商品超出库存量") {
        wx.showToast({
          // image: '../../images/icon_error.png',
          icon: "none",
          title: '库存不足',
          mask: true
        });
      } else if (res.text == "无法继续添加了") {
        wx.showToast({
          // image: '../../images/icon_error.png',
          icon: "none",
          title: '无法继续添加了',
          mask: true
        });
      }

    });
    // }
  },

  loginDialog: function () {
    this.setData({
      showLoginDialog: !this.data.showLoginDialog
    })
  },

  getUserInfo: function (e) {
    var self = this
    // console.info(e.detail.userInfo)
    if (e.detail.errMsg === "getUserInfo:ok") {
      var avatar = e.detail.userInfo.avatarUrl,
        nick_name = encodeURIComponent(e.detail.userInfo.nickName.replace(/%/g, '%25')),
        iv = e.detail.iv,
        encryptedData = e.detail.encryptedData

      this.login().then(function (res) {
        // if (res.length <= 0) {
        if (!res.avatar) {
          self.register(avatar, nick_name, iv, encryptedData).then(function (res) {
            // console.info(res)
            if (res.user_id) {
              app.globalData.user_id = res.user_id
              self.setData({
                showLoginDialog: false
              })

              // wx.showModal({
              //   title: '注册会员',
              //   content: '注册或绑定会员，可累积购物积分换好礼，更可享受线下充值送额度等其他权益，是否前往注册',
              //   success: function (e) {
              //     if (e.confirm) {
              //       wx.navigateTo({
              //         url: '../my/customer',
              //       })
              //     }
              //   }
              // })
              // console.info('---注册成功---')
            }
          })
        }
      })
      wx.showToast({
        title: '登录成功',
      })
      app.globalData.userInfo = e.detail.userInfo
    } else {
      wx.showModal({
        title: '登录失败',
        content: '授权登录，才能获取更多服务',
      })
    }
  },

  login: function () {
    var self = this
    return new Promise(function (resolve, reject) {
      wx.request({
        url: api.login,
        data: {
          op_id: app.globalData.openid
        },
        method: "post",
        success: function (res) {
          // console.info(res)
          resolve(res.data.data)
        },
      })
    })
  },

  register: function (avatar, nick_name, iv, encryptedData) {
    var self = this
    return new Promise(function (resolve, reject) {
      const openid = app.globalData.openid
      server.api(api.register, {
        op_id: openid,
        type: 0,
        avatar: avatar,
        nick_name: nick_name,
        iv: iv,
        encryptedData: encryptedData
      }, "post").then(function (res) {
        resolve(res)
      })
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
    this.getCartList()
  },

  getCartList: function () {
    var self = this
    server.api(api.getCart, {
      user_id: app.globalData.user_id
    }, "post").then(function (res) {
      // console.info(res)
      let checkedAllNumber = 0
      if (res.length > 0) {
        for (let i in res) {
          checkedAllNumber = checkedAllNumber + res[i].number
        }
      }
      self.setData({
        checkedAllNumber: checkedAllNumber
      })
    })
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
      path: '/pages/panic/panic'
    }
  }
})