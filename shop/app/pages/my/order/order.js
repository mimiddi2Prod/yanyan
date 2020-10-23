// pages/my/order/order.js
const api = require('../../../config/api.js')
const server = require('../../../utils/server.js')
const util = require('../../../utils/util.js')
const pay = require('../../../utils/pay.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sliderOffset: 0,
    // navList: [{
    //   id: 0,
    //   name: '全部订单',
    //   sliderOffset: 0
    // }, {
    //   id: 1,
    //   name: '待付款',
    //   sliderOffset: ''
    // }, {
    //   id: 2,
    //   name: '待发货',
    //   sliderOffset: ''
    // }, {
    //   id: 3,
    //   name: '待收货',
    //   sliderOffset: ''
    // }, {
    //   id: 4,
    //   name: '已送达',
    //   sliderOffset: ''
    // }],
    navList: [{
      id: 0,
      name: '全部订单',
      sliderOffset: 0
    }, {
      id: 1,
      name: '待付款',
      sliderOffset: ''
    }, {
      id: 2,
      name: '待收货',
      sliderOffset: ''
    }, {
      id: 3,
      name: '待评价',
      sliderOffset: ''
    }],
    currentId: 0,

    // 0 全部订单, 1 待支付, 2 待发货, 3 待收货, 4 已送达,
    // orderList: [{
    //   status: 0,
    //   last_id: 0,
    //   list: []
    // }, {
    //   status: 1,
    //   last_id: 0,
    //   list: []
    // }, {
    //   status: 2,
    //   last_id: 0,
    //   list: []
    // }, {
    //   status: 3,
    //   last_id: 0,
    //   list: []
    // }, {
    //   status: 4,
    //   last_id: 0,
    //   list: []
    // }],
    orderList: [{
      status: 0,
      last_id: 0,
      list: []
    }, {
      status: 1,
      last_id: 0,
      list: []
    }, {
      status: 2,
      last_id: 0,
      list: []
    }, {
      status: 3,
      last_id: 0,
      list: []
    }],
    // currentSecond: 60,
    // currentMinute: 29,
    // codeContent: '30:00',
    winHeight: 0,
    calc: 0,
    windowWidth: 0,

    // 用户是否进行上划加载操作
    isReachBottom: false,

    showPayMethodDialog: false,
    customerUid: '',

    orderId: '',
    // item_price_id:'',
    price: '',
    integrlprice: '',

    preIndex: 0,
    isSwitchCate: false,

    pageid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 导航栏标识线
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;

        var calc = clientHeight * rpxR;
        // console.info(calc)
        for (var i in that.data.navList) {
          that.data.navList[i].sliderOffset = res.windowWidth / that.data.navList.length * i
        }
        that.setData(that.data)
        that.setData({
          sliderOffset: res.windowWidth / that.data.navList.length * that.data.currentId,
          windowWidth: res.windowWidth,
          winHeight: calc + 10,
          calc: calc
        });
      }
    });
    // 导航栏标识线

    // 从my导航栏进来显示对应页面 id:1待付款（0） 2待发货（1） 3待收货（2） 4已送达（3）
    // 对应数据库  0 未支付 1 已支付 2已发货 3已收货（买家确认收货/物流送达后七天后自动确认收货） 4订单完成
    var status = -1
    if (options.id) {
      this.data.currentId = options.id
      this.data.isSwitchCate = true
      this.setData(this.data)
    }

    if (!options.id) {
      // this.getOrder(status)
      // 订单界面改版
      this.getOrderGroupTradeId(status)
    }
  },

  getOrderGroupTradeId: function(status) {
    // status:0待付款 1待发货 2待收货 3已送达
    var self = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    let last_id = self.data.orderList[status + 1].last_id
    // console.info(status)
    server.api(api.getOrderGroupTradeId, {
      user_id: app.globalData.user_id,
      // state: status,去掉待收货后
      state: (status >= 1 ? status + 1 : status),
      last_id: last_id
    }, "post").then(function(res) {
      // console.info(res)
      res = res.map(function(item) {
        item.create_time = util.formatTime(new Date(item.create_time))
        return item
      })
      if (res.length > 0) {
        let y = status + 1
        self.data.orderList[y].list = self.data.orderList[y].list.concat(res)
        if (status == -1 || status == 0) {
          for (let i = (self.data.orderList[y].last_id * 10); i < self.data.orderList[y].list.length; i++) {
            if (self.data.orderList[y].list[i].state == 0) {
              self.payInterval(y, i)
            }
          }
        }
        self.data.orderList[y].last_id++
          for (let i in self.data.orderList) {
            // console.info(self.data.orderList[i])
            if (self.data.orderList[i].list.length > 0) {
              self.data.orderList[i].list = self.data.orderList[i].list.map(function(e) {
                // e.imageO = e.image + '?imageView2/0/w/300/h/300'
                e.imageList = e.goodsList.map(function(fn) {
                  return fn.image + '?imageView2/0/w/300/h/300'
                })
                // e.total = Number(e.number * e.single_price).toFixed(2)
                return e
              })
            }
          }

        self.setData(self.data)
        wx.hideLoading()
      } else {
        wx.hideLoading()
        if (self.data.isReachBottom) {
          wx.showToast({
            title: '没有更多数据啦~',
            icon: 'none'
          })
          self.setData({
            isReachBottom: false
          })
        }
      }
    })
  },

  getOrder: function(status) {
    // status:0待付款 1待发货 2待收货 3已送达
    var self = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    let last_id = self.data.orderList[status + 1].last_id
    server.api(api.getOrder, {
      user_id: app.globalData.user_id,
      state: status,
      last_id: last_id
    }, "post").then(function(res) {
      // console.info(res)
      if (res.length > 0) {
        let y = status + 1
        self.data.orderList[y].list = self.data.orderList[y].list.concat(res)
        if (status == -1 || status == 0) {
          for (let i = (self.data.orderList[y].last_id * 10); i < self.data.orderList[y].list.length; i++) {
            if (self.data.orderList[y].list[i].state == 0) {
              self.payInterval(y, i)
            }
          }
        }
        self.data.orderList[y].last_id++
          for (let i in self.data.orderList) {
            // console.info(self.data.orderList[i])
            if (self.data.orderList[i].list.length > 0) {
              self.data.orderList[i].list = self.data.orderList[i].list.map(function(e) {
                // e.imageO = e.image + '?imageView2/0/w/300/h/300'
                e.imageList = e.goodsList.map(function(fn) {
                  return fn.image + '?imageView2/0/w/300/h/300'
                })
                // e.total = Number(e.number * e.single_price).toFixed(2)
                return e
              })
            }
          }

        self.setData(self.data)
        wx.hideLoading()
        // setTimeout(function(eData) {
        //   wx.hideLoading()
        // }, 1000)
      } else {
        wx.hideLoading()
        if (self.data.isReachBottom) {
          wx.showToast({
            title: '没有更多数据啦~',
            icon: 'none'
          })
          self.setData({
            isReachBottom: false
          })
        }
      }
    })
  },

  switchCate: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      currentId: e.target.dataset.id,
      isSwitchCate: true
    })
  },

  swiper: function(e) {
    // console.info(e)
    // 处理左右抖动问题
    if (e.detail.source == "" && !this.data.isSwitchCate) {
      this.setData({
        sliderOffset: this.data.windowWidth / this.data.navList.length * this.data.preIndex,
        currentId: this.data.preIndex,
      })
    } else {
      this.setData({
        sliderOffset: this.data.windowWidth / this.data.navList.length * e.detail.current,
        currentId: e.detail.current,
        preIndex: e.detail.current,
        isSwitchCate: false
      })
    }
    // this.setData({
    //   sliderOffset: this.data.windowWidth / this.data.navList.length * e.detail.current,
    //   currentId: e.detail.current,
    //   preIndex: e.detail.current
    // })
    var currentId = e.detail.current
    // 对应数据库  0 未支付 1 已支付 2已发货 3已收货（买家确认收货/物流送达后七天后自动确认收货） 4订单完成
    for (let i in this.data.orderList[currentId].list) {
      if (this.data.orderList[currentId].list[i].payInterval) {
        clearInterval(this.data.orderList[currentId].list[i].interval)
        this.data.orderList[currentId].list[i].payInterval = ''
      }
    }
    this.data.orderList[currentId].list = []
    this.data.orderList[currentId].last_id = 0
    this.setData(this.data)
    var status = Number(currentId) - 1
    // this.getOrder(status)
    this.getOrderGroupTradeId(status)
  },

  payInterval: function(orderListId, orderId) {
    const self = this
    var list = this.data.orderList[orderListId].list[orderId]
    var currentTime = new Date().getTime()
    var createTime = new Date(list.create_time).getTime()
    var oneHours = 60 * 60 * 1000
    var time = createTime + oneHours - currentTime
    if (time / oneHours < 1) {
      self.data.orderList[orderListId].list[orderId].interval = setInterval(() => {
        time = time - 1000;
        if (time < 0) {
          clearInterval(self.data.orderList[orderListId].list[orderId].interval)
          self.data.orderList[orderListId].list[orderId].payInterval = ''
          self.setData(self.data)
        } else {
          self.data.orderList[orderListId].list[orderId].payInterval = util.formatTime(new Date(time)).substring(14, 19)
          self.setData(self.data)
        }
      }, 1000)
    }
  },

  toOrderDetail: function(e) {
    var data = e.currentTarget.dataset
    app.globalData.orderDetail = this.data.orderList[data.pageid].list[data.orderid]
    this.data.pageid = data.pageid
    // console.info(data.pageid)
    this.setData(this.data)
    wx.navigateTo({
      url: 'orderDetail',
    })
  },

  toReview: function(e) {
    var data = e.currentTarget.dataset
    app.globalData.orderDetail = this.data.orderList[data.pageid].list[data.orderid]
    this.data.pageid = data.pageid
    // console.info(data.pageid)
    this.setData(this.data)
    wx.navigateTo({
      url: '../review',
    })
  },

  delOrder: function(e) {
    let tradeId = e.currentTarget.dataset.tradeid
    var self = this
    wx.showModal({
      content: '是否删除订单？删除后不可恢复',
      success: function(res) {
        if (res.confirm) {
          self.changeOrderState(tradeId, 5)
        }
      }
    })
  },

  // abandonOrder: function(e) {
  //   var orderId = e.currentTarget.dataset.orderid
  //   var self = this
  //   wx.showModal({
  //     content: '确定取消订单吗？',
  //     success: function(res) {
  //       if (res.confirm) {
  //         self.changeOrderState(orderId, -1)
  //       }
  //     }
  //   })
  // },
  // 改成通过tradeid
  abandonOrder: function(e) {
    var tradeid = e.currentTarget.dataset.tradeid
    var self = this
    wx.showModal({
      content: '确定取消订单吗？',
      success: function(res) {
        if (res.confirm) {
          self.changeOrderState(tradeid, -1)
        }
      }
    })
  },
  // acceptOrder: function(e) {
  //   var orderId = e.currentTarget.dataset.orderid
  //   var self = this
  //   wx.showModal({
  //     content: '确认收货吗？',
  //     success: function(res) {
  //       if (res.confirm) {
  //         self.changeOrderState(orderId, 3)
  //       }
  //     }
  //   })
  // },
  // 改成通过tradeid
  acceptOrder: function(e) {
    var tradeid = e.currentTarget.dataset.tradeid
    var self = this
    wx.showModal({
      content: '确认收货吗？',
      success: function(res) {
        if (res.confirm) {
          self.changeOrderState(tradeid, 3)
        }
      }
    })
  },

  // changeOrderState: function(orderId, willChangeState, tradeId) {
  //   var self = this
  //   // -1 取消订单 1已支付 3已收货
  //   server.api(api.changeOrderState, {
  //     order_id: orderId,
  //     state: willChangeState,
  //     // item_price_id: itemPriceId,
  //     trade_id: tradeId
  //   }, "post").then(function(res) {
  //     // debugger
  //     console.info(res)
  //     if (res.text == "更新订单成功") {
  //       // 用户积分
  //       // if (res.customer.data) {
  //       //   app.globalData.point = res.customer.data.pointAfterUpdate
  //       //   app.globalData.balance = res.customer.data.balanceAfterUpdate
  //       // }
  //       // self.clearIntervalByOrderId(orderId, tradeId)
  //       // self.data.orderList[self.data.currentId].list = self.data.orderList[self.data.currentId].list.map(function(fn) {
  //       //   if (fn.id == orderId) {
  //       //     clearInterval(fn.interval)
  //       //   }
  //       //   return fn
  //       // })
  //       // 刷新
  //       // var status = ''
  //       // if (self.data.currentId == 0) {
  //       //   // 全部订单
  //       //   status = -1
  //       //   self.data.orderList[0].list = []
  //       //   self.data.orderList[0].last_id = 0
  //       //   // if (tradeId) {
  //       //   // 全部订单也需要重新载入
  //       //   self.data.orderList[1].list = self.data.orderList[1].list.map(function(fn) {
  //       //     if (fn.interval) {
  //       //       clearInterval(fn.interval)
  //       //     }
  //       //     return fn
  //       //   })
  //       //   self.data.orderList[1].list = []
  //       //   self.data.orderList[1].last_id = 0
  //       //   // }
  //       // } else if (self.data.currentId == 1) {
  //       //   // 待付款
  //       //   status = 0
  //       //   self.data.orderList[1].list = []
  //       //   self.data.orderList[1].last_id = 0
  //       //   if (tradeId) {
  //       //     // 全部订单也需要重新载入
  //       //     self.data.orderList[0].list = self.data.orderList[0].list.map(function(fn) {
  //       //       if (fn.interval) {
  //       //         clearInterval(fn.interval)
  //       //       }
  //       //       return fn
  //       //     })
  //       //     self.data.orderList[0].list = []
  //       //     self.data.orderList[0].last_id = 0
  //       //   }
  //       // } else if (self.data.currentId == 3) {
  //       //   // 待收货
  //       //   status = 2
  //       //   self.data.orderList[3].list = []
  //       //   self.data.orderList[3].last_id = 0
  //       // } else if (self.data.currentId == 4) {
  //       //   // 已送达
  //       //   status = 3
  //       //   self.data.orderList[4].list = []
  //       //   self.data.orderList[4].last_id = 0
  //       // }


  //       // 全部订单也需要重新载入
  //       // self.data.orderList[0].list = self.data.orderList[0].list.map(function(fn) {
  //       //   if (fn.interval) {
  //       //     clearInterval(fn.interval)
  //       //   }
  //       //   return fn
  //       // })
  //       // self.data.orderList[0].list = []
  //       // self.data.orderList[0].last_id = 0

  //       let currentId = self.data.currentId
  //       let status = currentId - 1
  //       for (let i in self.data.orderList[currentId].list) {
  //         if (self.data.orderList[currentId].list[i].payInterval) {
  //           clearInterval(self.data.orderList[currentId].list[i].interval)
  //           self.data.orderList[currentId].list[i].payInterval = ''
  //         }
  //       }
  //       self.data.orderList[currentId].list = []
  //       self.data.orderList[currentId].last_id = 0

  //       self.setData(self.data)
  //       // self.getOrder(status)
  //       self.getOrderGroupTradeId(status)

  //       self.payDialog()
  //     }
  //   })
  //   // this.getOrder(willChangeState)
  // },
  // 改成通过tradeid
  changeOrderState: function(tradeId, willChangeState) {
    var self = this
    // -1 取消订单 1已支付 3已收货
    server.api(api.changeOrderState, {
      trade_id: tradeId,
      state: willChangeState,
      // item_price_id: itemPriceId,
      // trade_id: tradeId
    }, "post").then(function(res) {
      // debugger
      // console.info(res)
      if (res.text == "更新订单成功") {
        let currentId = self.data.currentId
        let status = currentId - 1
        for (let i in self.data.orderList[currentId].list) {
          if (self.data.orderList[currentId].list[i].payInterval) {
            clearInterval(self.data.orderList[currentId].list[i].interval)
            self.data.orderList[currentId].list[i].payInterval = ''
          }
        }
        self.data.orderList[currentId].list = []
        self.data.orderList[currentId].last_id = 0

        self.setData(self.data)
        // self.getOrder(status)
        self.getOrderGroupTradeId(status)

        self.payDialog()
      }
    })
    // this.getOrder(willChangeState)
  },
  // clearIntervalByOrderId: function (orderId, tradeId) {
  //   let self = this
  //   self.data.orderList[self.data.currentId].list = self.data.orderList[self.data.currentId].list.map(function(fn) {
  //     if (fn.id == orderId) {
  //       clearInterval(fn.interval)
  //     }
  //     return fn
  //   })
  //   // 刷新
  //   var status = ''
  //   if (self.data.currentId == 0) {
  //     // 全部订单
  //     status = -1
  //     self.data.orderList[0].list = []
  //     self.data.orderList[0].last_id = 0
  //     if (tradeId) {
  //       // 全部订单也需要重新载入
  //       self.data.orderList[1].list = self.data.orderList[1].list.map(function(fn) {
  //         if (fn.interval) {
  //           clearInterval(fn.interval)
  //         }
  //         return fn
  //       })
  //       self.data.orderList[1].list = []
  //       self.data.orderList[1].last_id = 0
  //     }
  //   } else if (self.data.currentId == 1) {
  //     // 待付款
  //     status = 0
  //     self.data.orderList[1].list = []
  //     self.data.orderList[1].last_id = 0
  //     if (tradeId) {
  //       // 全部订单也需要重新载入
  //       self.data.orderList[0].list = self.data.orderList[0].list.map(function(fn) {
  //         if (fn.interval) {
  //           clearInterval(fn.interval)
  //         }
  //         return fn
  //       })
  //       self.data.orderList[0].list = []
  //       self.data.orderList[0].last_id = 0
  //     }
  //   } else if (self.data.currentId == 3) {
  //     // 待收货
  //     status = 2
  //     self.data.orderList[3].list = []
  //     self.data.orderList[3].last_id = 0
  //   } else if (self.data.currentId == 4) {
  //     // 已送达
  //     status = 3
  //     self.data.orderList[4].list = []
  //     self.data.orderList[4].last_id = 0
  //   }
  //   self.setData(self.data)
  //   self.getOrder(status)
  // },

  payDialog: function() {
    this.setData({
      showPayMethodDialog: false
    })
  },

  toPayOrder: function(e) {
    // console.info(e.currentTarget.dataset)
    var self = this
    self.data.orderId = e.currentTarget.dataset.orderid
    self.data.price = e.currentTarget.dataset.price
    self.data.integrlprice = e.currentTarget.dataset.integrlprice
    self.setData({
      showPayMethodDialog: true
    })
  },

  wxPay: function() {
    var orderId = this.data.orderId,
      price = Number(this.data.price)
    let self = this,
      data = {}

    data.orderId = orderId
    // 拉起支付
    self.setData({
      showPayMethodDialog: false
    })
    pay.pay(api.payfeeContinue, price, data, "post").then(function(res) {
      // console.info(res)
      let tradeId = res
      // self.changeOrderState(orderId, 1, tradeId)
      // 取消待发货后
      self.changeOrderState(orderId, 2, tradeId)
    }).catch(function(res) {
      // 支付失败
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
    })
  },

  balancePay: function() {
    var orderId = this.data.orderId,
      price = Number(this.data.price),
      integrlprice = Number(this.data.integrlprice)
    let self = this
    if (self.data.customerUid) {
      if (app.globalData.balance > price) {
        // 根据银豹customerUid 更新对应余额和积分
        let data = {}
        data.customerUid = self.data.customerUid
        data.balanceIncrement = price
        data.pointIncrement = integrlprice <= 0 ? price : (0 - integrlprice)
        server.api(api.updateCustomerByCustomerUid, data, "post").then(function(res) {
          // console.info(res)
          if (res.code == 0) {
            app.globalData.balance = res.data.balanceAfterUpdate
            app.globalData.point = res.data.pointAfterUpdate
            // self.changeOrderState(orderId, 1, self.getTradeId('y'))
            // 取消待发货后
            self.changeOrderState(orderId, 2, self.getTradeId('y'))
            self.setData({
              showPayMethodDialog: false
            })
          }
        })
      } else {
        wx.showModal({
          title: '支付失败',
          content: '您的余额不足，请到线下充值',
          showCancel: false,
        })
      }
    } else {
      wx.showModal({
        title: '支付失败',
        content: '您还没有绑定/注册会员卡，是否前往绑定/注册',
        success: function(e) {
          if (e.confirm) {
            wx.navigateTo({
              url: '../../my/customer',
            })
          }
        }
      })
    }
  },

  getTradeId: function(str) {
    var date = new Date().getTime().toString()
    var text = ""
    var possible = "0123456789"
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    var tradeId = 'nw_' + date + text + str
    // console.info(tradeId)
    return tradeId
  },

  addIntegral: function(price) {
    if (this.data.customerUid.length < 0) {
      return false
    }
    // let data = {}
    // data.integral = parseInt(price)
    // data.user_id = app.globalData.user_id
    // data.state = 0 // 0 增加 1 减少
    // server.api(api.updateIntegral, data, "post").then(function (res) {
    //   console.info(res)
    // })
    let self = this
    // 根据银豹customerUid 更新对应余额和积分
    let data = {}
    data.customerUid = self.data.customerUid
    data.balanceIncrement = 0
    data.pointIncrement = self.data.getIntegral - self.data.costIntegral
    server.api(api.updateCustomerByCustomerUid, data, "post").then(function(res) {
      // console.info(res)
      if (res.code == 0) {
        app.globalData.balance = res.data.balanceAfterUpdate
        app.globalData.point = res.data.pointAfterUpdate
        // self.addOrderByState(1, self.getTradeId('y'))
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
    if (app.globalData.refreshOrder && this.data.pageid != 0 && this.data.pageid != 1) {
      var state = 3
      // console.info(this.data.orderList)
      this.data.orderList[4].list = []
      this.data.orderList[4].last_id = 0
      this.setData(this.data)
      // this.getOrder(state)
      this.getOrderGroupTradeId(state)
      app.globalData.refreshOrder = false
    }

    if (app.globalData.refreshOrder && (this.data.pageid == 0 || this.data.pageid == 1)) {
      var state = this.data.pageid
      // console.info(this.data.orderList)
      // console.info(state)
      this.data.orderList[state].list = []
      this.data.orderList[state].last_id = 0
      this.setData(this.data)
      // this.getOrder(state)
      this.getOrderGroupTradeId(state - 1)
      app.globalData.refreshOrder = false
    }

    this.getIntegral()
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
    var self = this
    this.setData({
      isReachBottom: true
    })

    // var state = ''
    // if (this.data.currentId == 0) {
    //   // 全部订单
    //   state = -1
    // } else if (this.data.currentId == 1) {
    //   // 待付款
    //   state = 0
    // } else if (this.data.currentId == 2) {
    //   // 待发货
    //   state = 1
    // } else if (this.data.currentId == 3) {
    //   // 待收货
    //   state = 2
    // } else if (this.data.currentId == 4) {
    //   // 已送达
    //   state = 3
    // }
    var state = Number(this.data.currentId) - 1
    // this.getOrder(state)
    this.getOrderGroupTradeId(state)

    self.data.winHeight = self.data.calc
    self.setData(self.data)

    setTimeout(function() {
      self.data.winHeight = self.data.calc + 10
      self.setData(self.data)
    }, 500)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})