// pages/activity/activity.js
const server = require('../../utils/server.js')
const api = require('../../config/api.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: '',
    text: '',
    item_last_id: 0,
    goodsList: [],
    showLoginDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.info(options)
    let id = options.id
    this.setData({
      image: options.image + "?imageView2/2/w/800/h/800",
      text: options.text,
      a_id: id,
      share_img: options.image
    })

    this.getOrderById(id)
  },

  getOrderById: function (id) {
    var self = this
    let data = {
      idList: id,
      item_last_id: self.data.item_last_id,
    }
    server.api(api.getActivityGoodsById, data, "post").then(function (res) {
      // console.info(res)
      if (res.length > 0) {
        res = res.map(function (eData) {
          eData.image[0] = eData.image[0] + "?imageView2/0/w/300/h/300"
          return eData
        })
        self.data.item_last_id++
        // self.data.waterfallGoods[self.data.waterfallGoods.length - 1].waterfallList = res.waterfallList
        self.data.goodsList.push({
          waterfallList: res
        })
      }
      self.setData(self.data)
      self.waterpanic()
    })
  },

  waterpanic: function () {
    let self = this
    let current_time = new Date()
    let date = current_time.getFullYear() + '/' + (current_time.getMonth() + 1) + '/' + current_time.getDate() + ' '
    let hms = current_time.getHours() + ':' + current_time.getMinutes() + ':' + current_time.getSeconds()
    let flag = 0,
      havePanic = false
    for (let j in self.data.goodsList) {
      let waterfallList = self.data.goodsList[j].waterfallList
      // console.info(waterfallList)
      for (let i in waterfallList) {
        waterfallList[i].isPanic = false
        if (waterfallList[i].panic_buying_id) {
          havePanic = true
          if (waterfallList[i].start_time <= hms && waterfallList[i].end_time > hms) {
            var currentTime = new Date().getTime()
            var endTime = new Date(date + waterfallList[i].end_time).getTime()
            var time = endTime - currentTime
            let h = '00',
              m = '00',
              s = '00',
              remainder
            waterfallList[i].interval = setInterval(() => {
              if (time <= 0) {
                clearInterval(waterfallList[i].interval)
                waterfallList[i].interval = ''
                // waterfallList[i] = {}
                waterfallList[i].isPanic = false
                self.data.goodsList[j].waterfallList = waterfallList
                self.setData(self.data)
                self.waterpanic()
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
                // waterfallList[i].time = h + ':' + m + ':' + s
                waterfallList[i].isPanic = true
                self.data.goodsList[j].waterfallList = waterfallList
                self.setData(self.data)
                // console.info(self.data.goodsList)
              }
            }, 1000)
          } else {
            flag++
            let num = 0
            for (let j in self.data.goodsList) {
              for (let i in self.data.goodsList[j].waterfallList) {
                if (self.data.goodsList[j].waterfallList[i].panic_buying_id) {
                  num++
                }
              }
            }
            if (flag == num && havePanic) {
              setTimeout(() => {
                self.waterpanic()
              }, 1000)
            }
          }
        }
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
      if (res.text == "添加成功") {
        wx.showToast({
          title: '添加成功',
          icon: "none",
        });
        app.globalData.refreshCart = true
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
      path: '/pages/activity/activity?id=' + this.data.a_id + '&image=' + this.data.share_img + '&text=' + this.data.text
    }
  }
})