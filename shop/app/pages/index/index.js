const server = require('../../utils/server.js')
const api = require('../../config/api.js');
// var QQMapWX = require('../../sdk/qqmap-wx-jssdk.js');
// var qqmapsdk;
var qqmapsdk = require('../../utils/qqMap.js').qqmapsdk

//获取应用实例
const app = getApp()
Page({
  data: {
    // ad
    banner: [], //轮播广告
    opening: [], //开门广告

    // goodsCount: 0, //商品总数
    waterfallGoods: [], //瀑布流

    channel: [], //导航
    item_last_id: 0, //瀑布流加载id
    topic_last_id: 0, //精选推荐加载id
    // 模态框
    showModal: true, //开门广告开启

    warmText: '',


    subkey: '',
    polyline: [{
      points: []
    }],
    // markers: [{
    //   latitude: '',
    //   longitude: '',
    //   title: 'dasd',
    //   iconPath: '../../images/A.png',
    // }],
    // mylongitude: '',
    // mylatitude: '',
    myLocationName: '',
    longitude: '',
    latitude: '',
    // keyword: '',
    // mapList: [],
    // distance: '',
    locationState: 0, // 0距离在配送范围 1距离过远 2定位失败 

    showLoginDialog: false,

    // 抢购
    panicBuying: [],
    current_panicBuying: {},

    start_time: '00: 00: 00',
    panic_text: '',
  },

  toPanic: function () {
    wx.navigateTo({
      url: '../panic/panic',
    })
  },

  // regionchange:function(e){

  //   console.info(e)
  //   // console.info(this.data.polyline)
  //   // console.info(this.data.markers)
  // },
  // openMap: function() {
  //   wx.openLocation({
  //     latitude: this.data.latitude,
  //     longitude: this.data.longitude,
  //     name: '这是定位名字',
  //     address: '这是地址'
  //   });
  // },

  // Input: function(e) {
  //   this.setData({
  //     keyword: e.detail.value
  //   })
  //   var self = this
  //   qqmapsdk.search({
  //     keyword: e.detail.value,
  //     success: function(res) {
  //       console.log(res);
  //       self.setData({
  //         mapList: res.data
  //       })
  //     },
  //     fail: function(res) {
  //       console.log(res);
  //     },
  //     complete: function(res) {
  //       console.log(res);
  //     }
  //   })


  // },


  // getLocation: function(e) {
  //   console.info(e)
  //   var self = this
  //   this.data.longitude = e.currentTarget.dataset.location.lng
  //   this.data.latitude = e.currentTarget.dataset.location.lat
  //   this.data.markers[0].longitude = e.currentTarget.dataset.location.lng
  //   this.data.markers[0].latitude = e.currentTarget.dataset.location.lat

  //   this.getDistance()
  // },

  getDistance: function () {
    let self = this
    let flag = 0
    let Interval = setInterval(function () {
      if (app.globalData.shopLocation && app.globalData.mylatitude) {
        qqmapsdk.calculateDistance({
          mode: 'driving',
          from: {
            latitude: app.globalData.shopLocation.split(',')[0],
            longitude: app.globalData.shopLocation.split(',')[1]
          },
          to: [{
            latitude: app.globalData.mylatitude,
            longitude: app.globalData.mylongitude
          }],
          success: function (res) {
            // console.info(res)
            let distance = res.result.elements[0].distance
            // console.info(distance)
            if (distance > app.globalData.shopDistance) {
              self.setData({
                locationState: 1
              })
            }
            // self.setData({
            //   distance: res.result.elements[0].distance
            // })
          }
        })
        clearInterval(Interval)
      } else {
        flag++
        if (flag > 20) {
          clearInterval(Interval)
        }
      }
    }, 1000)
  },

  // 分享转发
  onShareAppMessage: function () {
    // return {
    //   title: 'NideShop',
    //   desc: '仿网易严选微信小程序商城',
    //   path: '/pages/index/index'
    // }
  },
  // 关闭开门广告
  showModal: function () {
    this.setData({
      showModal: false
    })
  },

  getMyLocationName: function () {
    let self = this
    let Interval = setInterval(() => {
      // console.info(app.globalData.mylatitude)
      if (app.globalData.mylatitude && app.globalData.mylongitude) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: app.globalData.mylatitude,
            longitude: app.globalData.mylongitude
          },
          get_poi: 1,
          poi_options: 'policy=2;radius=3000;page_size=20;page_index=1',
          success: function (res) {
            // console.info(res)
            // let address_component = res.result.address_component
            // console.info(address_component)
            // let name = ""
            // if (address_component.street_number) {
            //   name = address_component.street_number
            // } else if (address_component.street) {
            //   name = address_component.street
            // } else if (address_component.district) {
            //   name = address_component.district
            // }
            // console.info(name)
            // console.info(res)
            self.setData({
              // myLocationName: name
              // myLocationName: res.result.formatted_addresses.recommend
              myLocationName: res.result.pois[0].title
            })
          }
        })

        self.getDistance()
        clearInterval(Interval)
      } else if (self.data.myLocationName == '定位失败') {
        clearInterval(Interval)
      }
    }, 500)
  },

  getLocation: function () {
    let self = this
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: function (res) {
        app.globalData.mylatitude = res.latitude
        app.globalData.mylongitude = res.longitude
        self.setData({
          locationState: self.data.locationState ? self.data.locationState : 0,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: function (res) {
        self.setData({
          myLocationName: '定位失败',
          locationState: 2
        })
      }
    })
  },

  onLoad: function (options) {
    let self = this
    this.ad()
    this.subCategory()
    // this.brand()
    this.waterfall()
    this.getPanic()

    this.getLocation()
    this.getMyLocationName()

    this.setWinHeight()
    if (options.share_id) {
      // 是分享进来的
      this.beShare(options.share_id)
    }
  },
  // 对分享人进行记录 是新用户则原分享人累计1个人头
  beShare(share_id) {
    let self = this, Interval = setInterval(() => {
      if (app.globalData.user_id) {
        clearInterval(Interval)
        server.api(api.beShare, {
          share_id: share_id,
          be_share_id: app.globalData.user_id
        }, "POST")
      }
    }, 500)
  },

  // 页面高度 scroll-view需要防止整个页面跟着拖动
  setWinHeight: function () {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        self.setData(self.data)
        self.setData({
          winTop: (calc - 682) / 2,
          // winCartHeightInit: calc - 170,
          // winWidth: clientWidth
        });
      }
    });
  },

  ad: function () {
    var self = this
    server.api(api.ad, {}, "post").then(function (res) {
      // console.info(res)
      for (var i in res) {
        if (res[i].type == 'opening') {
          self.data.opening = res[i].data.map(function (eData) {
            eData.image = eData.image + "?imageView2/2/w/1600/h/1600"
            return eData
          })
        } else if (res[i].type == 'banner') {
          self.data.banner = res[i].data.map(function (eData) {
            eData.image = eData.image + "?imageView2/2/w/1600/h/1600"
            return eData
          })
        }
      }
      self.setData(self.data)
    })
  },

  subCategory: function () {
    var self = this
    server.api(api.subCategory, {}, "post").then(function (res) {
      console.info(res)
      res = res.map(function (eData) {
        eData.image = eData.image + "?imageView2/0/w/300/h/300"
        return eData
      })
      self.setData({
        channel: res
      })
    })
  },

  toCatalog: function (e) {
    app.globalData.catalogid = e.currentTarget.dataset.cateid
    // 版本变更
    // wx.switchTab({
    //   url: '../catalog/catalog',
    // })
    wx.switchTab({
      url: '../catalogTop/catalogTop',
    })
  },

  // brand: function() {
  //   var self = this
  //   server.api(api.brand, {}, "post").then(function(res) {
  //     console.info(res)
  //     res = res.map(function(eData) {
  //       eData.image = eData.image + "?imageView2/2/w/600/h/600"
  //       return eData
  //     })
  //     self.setData({
  //       brand: res
  //     })
  //   })
  // },

  getPanic: function () {
    var self = this
    server.api(api.getPanic, {
      item_last_id: self.data.item_last_id,
      topic_last_id: self.data.topic_last_id,
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
        self.data.panicBuying = res.panicBuying
        app.globalData.panicBuying = res.panicBuying
        self.panic()
      } else {
        self.data.panic_text = '今日限时抢购已结束，请期待明日'
        self.data.start_time = ''
      }
      self.setData(self.data)
    })
  },

  waterpanic: function () {
    function checkTime(i) {
      if (i < 10) {
        i = "0" + i
      }
      return i
    }
    let self = this
    let current_time = new Date()
    let date = current_time.getFullYear() + '/' + (current_time.getMonth() + 1) + '/' + current_time.getDate() + ' '
    let hms = checkTime(current_time.getHours()) + ':' + checkTime(current_time.getMinutes()) + ':' + checkTime(current_time.getSeconds())
    let flag = 0,
      havePanic = false
    for (let j in self.data.waterfallGoods) {
      let waterfallList = self.data.waterfallGoods[j].waterfallList
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
                self.data.waterfallGoods[j].waterfallList = waterfallList
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
                self.data.waterfallGoods[j].waterfallList = waterfallList
                self.setData(self.data)
                // console.info(self.data.waterfallGoods)
              }
            }, 1000)
          } else {
            flag++
            let num = 0
            for (let j in self.data.waterfallGoods) {
              for (let i in self.data.waterfallGoods[j].waterfallList) {
                if (self.data.waterfallGoods[j].waterfallList[i].panic_buying_id) {
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

  waterfall: function () {
    var self = this
    server.api(api.waterfall, {
      item_last_id: self.data.item_last_id,
      topic_last_id: self.data.topic_last_id,
      type: 0,
    }, "post").then(function (res) {
      // console.info(res)
      if (res.waterfallList.length > 0 || res.topic.length > 0) {
        self.data.waterfallGoods.push({})
      } else {
        self.data.warmText = "没有更多数据了~"
      }
      if (res.waterfallList.length > 0) {
        res.waterfallList = res.waterfallList.map(function (eData) {
          if (eData.label[0]) {
            eData.label[0] = eData.label[0] + "?imageView2/0/w/110/h/40"
          }
          eData.image[0] = eData.image[0] + "?imageView2/0/w/300/h/300"
          return eData
        })
        self.data.item_last_id++
        self.data.waterfallGoods[self.data.waterfallGoods.length - 1].waterfallList = res.waterfallList
      }
      if (res.topic.length > 0) {
        res.topic = res.topic.map(function (eData) {
          eData.image[0] = eData.image[0] + '?imageView2/2/w/800/h/800'
          return eData
        })
        self.data.topic_last_id++
        self.data.waterfallGoods[self.data.waterfallGoods.length - 1].topic = res.topic
      }
      // // 抢购
      // if (res.panicBuying.length > 0) {
      //   // console.info(res.panicBuying)
      //   // let current_time = new Date()
      //   // let date = current_time.getFullYear() + '/' + (current_time.getMonth() + 1) + '/' + current_time.getDate() + ' '
      //   // let hms = current_time.getHours() + ':' + current_time.getMinutes() + ':' + current_time.getSeconds()

      //   for (let i in res.panicBuying) {
      //     res.panicBuying[i].list = res.panicBuying[i].list.map(function(eData) {
      //       eData.image[0] = eData.image[0] + '?imageView2/2/w/800/h/800'
      //       return eData
      //     })
      //   }
      //   self.data.panicBuying = res.panicBuying
      //   app.globalData.panicBuying = res.panicBuying
      //   self.panic()
      //   // for (let i in res.panicBuying) {
      //   //   if (res.panicBuying[i].start_time <= hms && res.panicBuying[i].end_time > hms) {
      //   //     self.data.current_panicBuying = res.panicBuying[i]

      //   //     var currentTime = new Date().getTime()
      //   //     var endTime = new Date(date + res.panicBuying[i].end_time).getTime()
      //   //     var time = endTime - currentTime
      //   //     let h = '00',
      //   //       m = '00',
      //   //       s = '00',
      //   //       remainder
      //   //     self.data.current_panicBuying.interval = setInterval(() => {
      //   //       if (time <= 0) {
      //   //         clearInterval(self.data.current_panicBuying.interval)
      //   //         self.data.current_panicBuying.interval = ''
      //   //         self.setData(self.data)
      //   //       } else {
      //   //         time = time - 1000
      //   //         let ex = (time / 1000) >> 0
      //   //         h = (ex / 3600) >> 0
      //   //         h = h < 10 ? '0' + h : h
      //   //         remainder = ex % 3600
      //   //         if (remainder > 0) {
      //   //           m = (remainder / 60) >> 0
      //   //           m = m < 10 ? '0' + m : m
      //   //           remainder = remainder % 60
      //   //           if (remainder > 0) {
      //   //             s = remainder
      //   //             s = s < 10 ? '0' + s : s
      //   //           }
      //   //         }
      //   //         self.data.current_panicBuying.time = h + ':' + m + ':' + s
      //   //         self.setData(self.data)
      //   //       }
      //   //     }, 1000)
      //   //     break
      //   //   }
      //   // }
      // }
      self.setData(self.data)
      self.waterpanic()
    })
  },

  panic: function () {
    function checkTime(i) {
      if (i < 10) {
        i = "0" + i
      }
      return i
    }
    let self = this
    let current_time = new Date()
    let date = current_time.getFullYear() + '/' + (current_time.getMonth() + 1) + '/' + current_time.getDate() + ' '
    let hms = checkTime(current_time.getHours()) + ':' + checkTime(current_time.getMinutes()) + ':' + checkTime(current_time.getSeconds())
    self.data.panic_text = ''
    let flag = 0,
      start_time = null
    for (let i in self.data.panicBuying) {
      if (self.data.panicBuying[i].start_time <= hms && self.data.panicBuying[i].end_time > hms) {
        self.data.current_panicBuying = self.data.panicBuying[i]

        app.globalData.current_panicBuying = self.data.current_panicBuying
        let currentTime = new Date().getTime()
        let endTime = new Date(date + self.data.panicBuying[i].end_time).getTime()
        let time = endTime - currentTime
        let h = '00',
          m = '00',
          s = '00',
          remainder
        self.data.current_panicBuying.interval = setInterval(() => {
          if (time <= 0) {
            clearInterval(self.data.current_panicBuying.interval)
            self.data.current_panicBuying.interval = ''
            self.data.current_panicBuying = {}
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
            self.data.current_panicBuying.time = h + ':' + m + ':' + s
            self.setData(self.data)
          }
        }, 1000)
        break
      } else {
        flag++
        if (self.data.panicBuying[i].start_time > hms) {
          if (!start_time) {
            start_time = self.data.panicBuying[i].start_time
          }
          if (self.data.panicBuying[i].start_time < start_time) {
            start_time = self.data.panicBuying[i].start_time
          }
        }
        if (self.data.panicBuying[i].start_time > hms) {
          // 距离抢购开始时间
          let currentTime = new Date().getTime()
          let startTime = new Date(date + start_time).getTime()
          let time = startTime - currentTime
          let h = '00',
            m = '00',
            s = '00',
            remainder

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
          self.data.panic_text = '距离开始还有'
          self.data.start_time = h + ':' + m + ':' + s
          self.data.current_panicBuying.list = self.data.panicBuying[i].list
          self.setData(self.data)
          setTimeout(() => {
            self.panic()
          }, 1000)
          break
        }
        if (flag == self.data.panicBuying.length) {
          app.globalData.current_panicBuying = null
          if (!start_time) {
            self.data.panic_text = '今日限时抢购已结束，请期待明日'
            self.data.start_time = ''
            let timeout = new Date(current_time.getFullYear() + '/' + (current_time.getMonth() + 1) + '/' + (current_time.getDate() + 1) + ' ' + '00:00:03').getTime() - new Date().getTime()
            setTimeout(function () {
              self.getPanic()
            }, timeout)
            break
          }
        }
      }
    }
  },

  onReachBottom: function () {
    this.waterfall()
  },

  onReady: function () {
    // 页面渲染完成
  },

  getCartList: function () {
    var self = this
    let Interval = setInterval(() => {
      if (app.globalData.user_id) {
        clearInterval(Interval)
        server.api(api.getCart, {
          user_id: app.globalData.user_id
        }, "post").then(function (res) {
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
      }
    }, 500)
  },

  onShow: function () {
    let self = this
    this.getCartList()
    // 页面显示
    if (this.data.locationState == 2) {
      // 没权限
      this.getLocation()
      this.getMyLocationName()
      // return
    }
    if (this.data.latitude != app.globalData.mylatitude) {
      this.getMyLocationName()
      this.setData({
        locationState: 0
      })
    }

    // 距离外
    let flag = 0
    let Interval = setInterval(function () {
      if (self.data.locationState == 1) {
        if (app.globalData.adreslat && app.globalData.adreslng) {
          app.globalData.mylatitude = app.globalData.adreslat
          app.globalData.mylongitude = app.globalData.adreslng
          self.setData({
            locationState: 0
          })
          self.getMyLocationName()
        }
        clearInterval(Interval)
      } else {
        flag++
        if (flag == 20) {
          clearInterval(Interval)
        }
      }
    }, 500)

    // }
  },


  addToCart: function (e) {
    var self = this;
    // 判断是否注册过
    // 如果没有 需要跳转 写有登录按钮的页面去登录
    if (app.globalData.user_id == '' || !app.globalData.userInfo) {
      this.loginDialog()
      return
    }
    // console.info(e)
    // console.info(111111)
    // var addCartInfo = this.data.goods
    // let stock = ''

    // if (self.data.number > addCartInfo.stock) {
    //   wx.showToast({
    //     image: '../../images/icon_error.png',
    //     title: '库存不足',
    //     mask: true
    //   });
    //   return false;
    // }

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
          duration: 1000
        });
        app.globalData.refreshCart = true
        // self.setData({
        //   openAttr: !self.data.openAttr
        // });
        // self.getCartList()
        self.getCartList()
      } else if (res.text == "添加商品超出库存量") {
        wx.showToast({
          // image: '../../images/icon_error.png',
          icon: "none",
          title: '库存不足',
          duration: 1000,
          mask: true
        });
      } else if (res.text == "无法继续添加了") {
        wx.showToast({
          // image: '../../images/icon_error.png',
          icon: "none",
          title: '无法继续添加了',
          duration: 1000,
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
        duration: 1000
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

  // 获取领取列表
  getCouponCard: function () {
    let self = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    server.api(api.getCouponCard, {
      'openid': app.globalData.openid,
      'type': 'opening'
    }, 'post').then(function (res) {
      wx.hideLoading()
      wx.addCard({
        cardList: res.cardList,
        success: function (e) {
          // 诗雷对线一周
          self.cardWatcher(app.globalData.openid, res.cardList, e, 'success')
          if (e.cardList.length) {
            e.cardList = e.cardList.filter(val => {
              return val.code && val.code != "null"
            })
            self.saveCard(JSON.stringify(e))
          }
          // self.saveCard(JSON.stringify(e))
        },
        complete: function (e) {
          // console.info(e)
          // 诗雷对线一周
          self.cardWatcher(app.globalData.openid, res.cardList, e, 'complete')
        }
      })
    })
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

  saveCard: function (data) {
    // console.info(data)
    // 诗雷对线一周
    this.cardWatcher(app.globalData.openid, JSON.parse(data), [], "save")
    server.api(api.saveCard, {
      'openid': app.globalData.openid,
      'cardList': data
    }, 'post').then(function (res) {
      // console.info(res)
    })
  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onShareAppMessage: function () {
    // 分享
  }
})