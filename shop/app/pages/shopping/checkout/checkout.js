// pages/shopping/checkout/checkout.js
var server = require('../../../utils/server.js');
const api = require('../../../config/api.js');
const pay = require('../../../utils/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00, //快递费
    couponPrice: 0.00, //优惠券的价格
    orderTotalPrice: 0.00, //订单总价
    actualPrice: 0.00, //实际需要支付的总价
    addressId: 0,
    couponId: 0,
    getIntegral: 0,
    costIntegral: 0,

    showPayMethodDialog: false,
    // customerUid: '',

    cardList: [],
    // selectCard: {},

    // 配送费规则
    delivery_fee: '', // 配送费
    free_delivery_fee: '', // 多少免配送费

    note: '',
  },

  getCartList: function (e) {
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    var self = this
    server.api(api.getCart, {
      user_id: app.globalData.user_id,
      ver: '2.0'
    }, "post").then(function (res) {
      wx.hideLoading()
      self.panic(res.time, res.order)
    })
  },
  panic(Time, cart) {
    var self = this
    let Cart = cart, checkedGoodsList = this.data.checkedGoodsList
    function checkTime(i) {
      if (i < 10) {
        i = "0" + i
      }
      return i
    }
    let current_time = new Date(Time)
    let date = current_time.getFullYear() + '/' + checkTime(current_time.getMonth() + 1) + '/' + checkTime(current_time.getDate()) + ' '
    let hms = checkTime(current_time.getHours()) + ':' + checkTime(current_time.getMinutes()) + ':' + checkTime(current_time.getSeconds())
    let day = current_time.getDay() == 0 ? 7 : current_time.getDay()

    let IsCheckedList = []
    for (let i in Cart) {
      if (Cart[i].panic_buying_id) {
        let weekTime = new RegExp(Cart[i].week)
        Cart[i].isPanic = false
        if (Cart[i].start_time <= hms && Cart[i].end_time > hms && weekTime.test(day)) {
          Cart[i].isPanic = true
        }
      }
      for (let j in checkedGoodsList) {
        if (Cart[i].id == checkedGoodsList[j].id) {
          Cart[i].imageC = Cart[i].image + "?imageView2/0/w/300/h/300"
          IsCheckedList.push(Cart[i])
        }
      }
    }

    function PriceIsErr() {
      wx.showModal({
        title: "提示",
        content: "当前商品价格发生了变化",
        showCancel: false
      })
      app.globalData.refreshCart = true
      app.globalData.orderList = IsCheckedList
      self.getOrderList()
    }
    for (let i in IsCheckedList) {
      for (let j in checkedGoodsList) {
        if (IsCheckedList[i].id == checkedGoodsList[j].id) {
          if (IsCheckedList[i].isPanic) {
            // 在限时抢购中
            if (IsCheckedList[i].isPanic == checkedGoodsList[j].isPanic) {
              if (IsCheckedList[i].panic_buying_price != checkedGoodsList[j].panic_buying_price) {
                PriceIsErr(IsCheckedList)
                return
              }
            } else {
              PriceIsErr(IsCheckedList)
              return
            }
          } else {
            // 不在限时抢购中
            if (IsCheckedList[i].isPanic == checkedGoodsList[j].isPanic) {
              if (IsCheckedList[i].price != checkedGoodsList[j].price) {
                PriceIsErr(IsCheckedList)
                return
              }
            } else {
              PriceIsErr(IsCheckedList)
              return
            }
          }
        }
      }
    }

    if (self.data.actualPrice > 0) {
      self.setData({
        showPayMethodDialog: true
      })
    } else if (self.data.actualPrice <= 0) {
      wx.showModal({
        title: '是否换购',
        content: '您将消费积分0元换购，退换货积分不退回',
        success: function (res) {
          if (res.confirm) {
            // 取消待发货后
            self.addOrderByState(2, self.getTradeId('f'))
            self.updateIntegral()
          }
        }
      })
    }
  },

  // 备注
  getNote: function (e) {
    this.setData({
      note: e.detail.value
    })
  },

  onLoad: function (options) {
    this.setData({
      delivery_fee: app.globalData.delivery_fee,
      free_delivery_fee: app.globalData.free_delivery_fee,
    })
  },

  getCardList: function () {
    let self = this
    server.api(api.getCard, {
      'openid': app.globalData.openid
    }, 'post').then(function (res) {
      // console.info(res)
      if (res.length > 0) {
        // 去除过期优惠券
        console.info(res)
        res = res.filter(function (item) {
          // todo pEl0pw3rG7YxyuFNIuJ1hENpgF9k的 || 判断 2020/09/17后才能去掉
          return (new Date(item.end_time).getTime() > new Date().getTime() && new Date(item.begin_time).getTime() < new Date().getTime())
        })
        self.setData({
          cardList: res,
          // selectCard: res[0]
        })
      }
    })
  },

  toCouponCard: function () {
    app.globalData.cardList = this.data.cardList
    wx.navigateTo({
      url: '/pages/couponCard/couponCard?price=' + this.data.goodsTotalPrice,
    })
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/my/address?selectAddress=true',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/my/address?selectAddress=true',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    this.getOrderList()
    this.getAddress()
    this.getCardList()
    // this.setData({
    //   customerUid: app.globalData.customerUid
    // })
  },

  getOrderList() {
    let self = this
    var orderList = app.globalData.orderList
    console.info(orderList)
    var price = 0,
      freightPrice = 0,
      costIntegral = 0,
      getIntegral = 0,
      goodsPrice = 0,
      reduce_cost = 0
    orderList.map(function (res) {
      if (res.integral_price <= 0) {
        getIntegral = getIntegral + (res.number * res.price)
      }

      // 判断是否是抢购价
      if (res.isPanic) {
        price = price + (res.number * res.panic_buying_price)
        goodsPrice = goodsPrice + (res.number * res.panic_buying_price)
      } else {
        price = price + (res.number * res.price)
        goodsPrice = goodsPrice + (res.number * res.price)
      }

      costIntegral = costIntegral + (res.number * res.integral_price)
    })
    // setTimeout(function() {

    // 是否免配送费
    if (app.globalData.free_delivery_fee > price) {
      // price = price + app.globalData.delivery_fee
      freightPrice = app.globalData.delivery_fee
    }

    let selectCard = {}
    if (app.globalData.selectCard.id) {
      selectCard = app.globalData.selectCard
      if (price >= app.globalData.selectCard.least_cost) {
        price = price - app.globalData.selectCard.reduce_cost
        reduce_cost = app.globalData.selectCard.reduce_cost
      }
    }
    self.setData({
      checkedGoodsList: orderList,
      // goodsTotalPrice: Number(price).toFixed(2),
      goodsTotalPrice: Number(goodsPrice).toFixed(2),
      actualPrice: Number(price + freightPrice).toFixed(2),
      getIntegral: parseInt(getIntegral),
      costIntegral: costIntegral,
      freightPrice: freightPrice,
      selectCard: selectCard,
      reduce_cost: reduce_cost
    })
    // }, 1000)
  },

  getAddress() {
    if (app.globalData.selectAddress) {
      const selectAddress = app.globalData.selectAddress
      // this.data.checkedAddress.full_region = selectAddress.provinceName + selectAddress.cityName + selectAddress.countyName
      this.data.checkedAddress.full_region = selectAddress.adres
      this.data.checkedAddress.address = selectAddress.detailInfo
      this.data.checkedAddress.isDefault = selectAddress.isDefault
      this.data.checkedAddress.id = selectAddress.id
      this.data.checkedAddress.name = selectAddress.userName
      this.data.checkedAddress.mobile = selectAddress.telNumber
      this.setData(this.data)
      app.globalData.selectAddress = null
    } else if (app.globalData.default_address) {
      var default_address = app.globalData.default_address
      // this.data.checkedAddress.full_region = default_address.province + default_address.city + default_address.area
      this.data.checkedAddress.full_region = default_address.adres
      this.data.checkedAddress.address = default_address.road
      this.data.checkedAddress.isDefault = default_address.isDefault
      this.data.checkedAddress.id = default_address.id
      this.data.checkedAddress.name = default_address.receiver
      this.data.checkedAddress.mobile = default_address.tel
      this.setData(this.data)
    } else {
      this.data.checkedAddress = {}
      this.setData(this.data)
    }
  },

  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    var self = this
    let cTime = new Date()
    let time = (cTime.getHours() < 10 ? '0' + cTime.getHours() : cTime.getHours()) + ':' + (cTime.getMinutes() < 10 ? '0' + cTime.getMinutes() : cTime.getMinutes()) + ':' + (cTime.getSeconds() < 10 ? '0' + cTime.getSeconds() : cTime.getSeconds())
    if (time < app.globalData.start_time || time > app.globalData.end_time) {
      wx.showModal({
        title: '店铺已休息',
        content: '抱歉，店铺营业时间为' + app.globalData.start_time + '~' + app.globalData.end_time,
        showCancel: false
      })
      return false
    }

    if (!this.data.checkedAddress.id) {
      wx.showModal({
        title: '没有地址',
        content: '您还没有地址信息，请前往添加',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/address?selectAddress=true',
            })
          }
        }
      })
      return false;
    }

    this.getCartList()

    // if (self.data.actualPrice > 0) {
    //   self.setData({
    //     showPayMethodDialog: true
    //   })
    // } else if (self.data.actualPrice <= 0) {
    //   wx.showModal({
    //     title: '是否换购',
    //     content: '您将消费积分0元换购，退换货积分不退回',
    //     success: function (res) {
    //       if (res.confirm) {
    //         // 取消待发货后
    //         self.addOrderByState(2, self.getTradeId('f'))
    //         self.updateIntegral()
    //       }
    //     }
    //   })
    // }
  },

  payDialog: function () {
    this.setData({
      showPayMethodDialog: false
    })
  },

  checkStock: function (e) {
    let payMethod = e.currentTarget.dataset.pay // 0微信支付 1余额支付
    let self = this,
      data = {}

    // 余额支付的话 先检查是否有绑定会员卡/余额是否足够
    if (payMethod == 1) {
      // if (!app.globalData.isCustomer) {
      //   wx.showModal({
      //     title: '支付失败',
      //     content: '您还没有办理会员卡，是否前往注册',
      //     success: function(res) {
      //       if (res.confirm) {
      //         wx.navigateTo({
      //           url: '../customer/customer',
      //         })
      //       }
      //     }
      //   })
      //   return
      // }
      // if (self.data.actualPrice > app.globalData.balance) {
      //   wx.showModal({
      //     title: '支付失败',
      //     content: '会员卡余额不足，请前往前台充值',
      //     showCancel: false
      //   })
      //   return
      // }
      if (self.data.actualPrice > app.globalData.integral) {
        wx.showModal({
          title: '支付失败',
          content: '积分不足',
          showCancel: false
        })
        return
      }
    }

    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    data.user_id = app.globalData.user_id
    data.order = []
    // todo 商品库存验证
    for (let i in this.data.checkedGoodsList) {
      data.order.push({
        item_id: this.data.checkedGoodsList[i].item_id,
        // item_param_id_1: this.data.checkedGoodsList[i].item_param_id_1,
        // item_param_id_2: this.data.checkedGoodsList[i].item_param_id_2,
        // param_1: this.data.checkedGoodsList[i].param_1,
        // param_2: this.data.checkedGoodsList[i].param_2,
        name: this.data.checkedGoodsList[i].name,
        number: this.data.checkedGoodsList[i].number
      })
    }
    server.api(api.checkOrderStock, data, "post").then(function (res) {
      // console.info(res)
      if (res.code == 0) {
        if (res.canPay == 0) {
          if (payMethod == 0) {
            // self.wxPay(data)
            self.wxPay()
          } else if (payMethod == 1) {
            self.balancePay()
          }
        } else {
          let shortageName = res.shortageList.map(function (eData) {
            // return eData.name + '(' + eData.param_1 + ' ' + eData.param_2 + ')' + 'x' + eData.stock
            return eData.name + 'x' + eData.stock
          }).join(',')
          wx.hideLoading()
          wx.showModal({
            title: '支付失败',
            content: '剩余 ' + shortageName + ' 库存不足，请重新选择商品',
            showCancel: false
          })
        }
      } else {
        wx.showModal({
          title: '',
          // content: '请求失败，请联系前台服务员',
          showCancel: false
        })
      }
    })
  },

  getWXPayOrderList: function () {
    let call = []
    // console.info(this.data.checkedGoodsList)
    var orderList = this.data.checkedGoodsList
    var address = this.data.checkedAddress
    var self = this
    // var submitNum = 0
    // console.info(orderList)

    // console.info(tradeId)
    for (var i in orderList) {
      var data = {}
      data.user_id = app.globalData.user_id
      data.open_id = app.globalData.openid
      // data.customerUid = ''
      // if (app.globalData.customerUid) {
      //   data.customerUid = app.globalData.customerUid
      // }
      data.item_id = orderList[i].item_id
      data.name = orderList[i].name
      // data.param_id_1 = orderList[i].item_param_id_1
      // data.param_id_2 = orderList[i].item_param_id_2
      // data.param_1 = orderList[i].param_1
      // data.param_2 = orderList[i].param_2
      data.image = orderList[i].image
      data.number = orderList[i].number
      // data.single_price = orderList[i].price
      if (orderList[i].isPanic) {
        data.single_price = orderList[i].panic_buying_price
      } else {
        data.single_price = orderList[i].price
      }
      data.postage = this.data.freightPrice
      data.state = 0 // 0未支付 1支付
      data.address_text = address.full_region + address.address
      data.tel = address.mobile
      data.receiver = address.name
      // data.tradeId = tradeId
      if (orderList[i].integral_price <= 0) {
        data.have_cost_integral = 0
      } else if (orderList[i].integral_price > 0) {
        data.have_cost_integral = 1
      }
      data.integral_price = orderList[i].integral_price

      if (app.globalData.selectCard.id) {
        data.select_card_id = app.globalData.selectCard.id
        data.reduce_cost = app.globalData.selectCard.reduce_cost
      }

      data.note = this.data.note

      call.push(data)
    }

    return call
  },

  wxPay: function () {
    // wx.showLoading({
    //   title: '',
    // })
    let self = this
    let order = self.getWXPayOrderList()
    // console.info(order)
    // // 拉起支付
    pay.pay(api.payfee, self.data.actualPrice, order, "post").then(function (res) {
      // console.info(res)
      // self.addOrderByState(1, res)
      // self.updateIntegral()
      wx.hideLoading()
      wx.showToast({
        title: '支付成功',
      })
      // 跳转显示订单状态
      let address = self.data.checkedAddress
      app.globalData.payInfo.address = address
      app.globalData.payInfo.state = 1
      app.globalData.payInfo.actualPrice = self.data.actualPrice

      wx.redirectTo({
        url: '../../payResult/payResult',
      })

    }).catch(function (res) {
      // self.addOrderByState(0, res)
      // 跳转显示订单状态
      let address = self.data.checkedAddress
      app.globalData.payInfo.address = address
      app.globalData.payInfo.state = 0
      app.globalData.payInfo.actualPrice = self.data.actualPrice

      wx.redirectTo({
        url: '../../payResult/payResult',
      })
    })
  },

  // balancePay: function() {
  //   wx.showLoading({
  //     title: '',
  //   })
  //   let self = this
  //   if (self.data.customerUid) {
  //     if (app.globalData.balance > Number(self.data.actualPrice)) {
  //       // 根据银豹customerUid 更新对应余额和积分
  //       let data = {}
  //       data.customerUid = self.data.customerUid
  //       data.balanceIncrement = self.data.actualPrice
  //       data.pointIncrement = self.data.costIntegral <= 0 ? self.data.actualPrice : (0 - Number(self.data.costIntegral))
  //       server.api(api.updateCustomerByCustomerUid, data, "post").then(function(res) {
  //         console.info(res)
  //         if (res.code == 0) {
  //           wx.hideLoading()
  //           app.globalData.balance = res.data.balanceAfterUpdate
  //           app.globalData.point = res.data.pointAfterUpdate
  //           self.addOrderByState(1, self.getTradeId('y'))
  //         }
  //       })
  //     } else {
  //       wx.showModal({
  //         title: '支付失败',
  //         content: '您的余额不足，请到线下充值',
  //         showCancel: false,
  //       })
  //     }
  //   } else {
  //     wx.showModal({
  //       title: '支付失败',
  //       content: '您还没有绑定/注册会员卡，是否前往绑定/注册',
  //       success: function(e) {
  //         if (e.confirm) {
  //           wx.navigateTo({
  //             url: '../../my/customer',
  //           })
  //         }
  //       }
  //     })
  //   }
  // },

  balancePay: function () {
    wx.showLoading({
      title: '',
    })
    let self = this
    // self.addOrderByState(1, self.getTradeId('y'))
    // 取消待发货后
    self.addOrderByState(2, self.getTradeId('y'))
    // if (self.data.customerUid) {
    // if (app.globalData.balance > Number(self.data.actualPrice)) {
    //   // 根据银豹customerUid 更新对应余额和积分
    //   let data = {}
    //   data.customerUid = self.data.customerUid
    //   data.balanceIncrement = self.data.actualPrice
    //   data.pointIncrement = self.data.costIntegral <= 0 ? self.data.actualPrice : (0 - Number(self.data.costIntegral))
    //   server.api(api.updateCustomerByCustomerUid, data, "post").then(function(res) {
    //     console.info(res)
    //     if (res.code == 0) {
    //       wx.hideLoading()
    //       app.globalData.balance = res.data.balanceAfterUpdate
    //       app.globalData.point = res.data.pointAfterUpdate
    //       self.addOrderByState(1, self.getTradeId('y'))
    //     }
    //   })
    // } else {
    //   wx.showModal({
    //     title: '支付失败',
    //     content: '您的余额不足，请到线下充值',
    //     showCancel: false,
    //   })
    // }
    // } else {
    //   wx.showModal({
    //     title: '支付失败',
    //     content: '您还没有绑定/注册会员卡，是否前往绑定/注册',
    //     success: function(e) {
    //       if (e.confirm) {
    //         wx.navigateTo({
    //           url: '../../my/customer',
    //         })
    //       }
    //     }
    //   })
    // }
  },

  getAverageDisCountPrice: function (order) {
    // 计算总价用于平均
    let total_price = 0
    for (let i in order) {
      order[i].single_price = Number(order[i].single_price)
      total_price = (Number(total_price) + (order[i].single_price * order[i].number)).toFixed(2)
    }
    total_price = Number(total_price)

    let reduce_cost = order[0].reduce_cost
    let temp = null
    // 价格高到低
    for (let i = 0; i < order.length - 1; i++) {
      for (let j = 0; j < order.length - 1 - i; j++) {
        if (Number(order[j].single_price) < Number(order[j + 1].single_price)) {
          temp = order[j]
          order[j] = order[j + 1]
          order[j + 1] = temp
        }
      }
    }
    let cost = 0,
      // 计算单样物品折扣后，剩余折扣价格
      emaining = reduce_cost,
      //保留两位小数，四舍五入
      avg = Math.round((reduce_cost / total_price) * 100) / 100

    for (let i = 0; i < order.length; i++) {
      // 最后一项
      if (i == order.length - 1) {
        order[i].disCountPrice = Number((order[i].single_price - (emaining / order[i].number)).toFixed(2))
        order[i].disCountPriceTotal = Number((order[i].single_price * order[i].number - emaining).toFixed(2))
        break
      }
      // 前n - 1项
      cost = Number((avg * order[i].single_price).toFixed(2))
      emaining = Number((emaining - (cost * order[i].number)).toFixed(2))
      order[i].disCountPrice = Number((order[i].single_price - cost).toFixed(2))
      order[i].disCountPriceTotal = Number((order[i].disCountPrice * order[i].number).toFixed(2))
    }
    return order
  },

  getTradeId: function (str) {
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

  // updatePoint: function() {
  //   let data = {}
  //   // data.integral = this.data.getIntegral - this.data.costIntegral
  //   // data.user_id = app.globalData.user_id
  //   server.api(api.updateCustomerByCustomerUid, data, "post").then(function(res) {
  //     console.info(res)
  //   })
  // },

  // updateIntegral: function() {
  //   let self = this
  //   if (self.data.customerUid.length < 0) {
  //     return false
  //   }
  //   // 根据银豹customerUid 更新对应余额和积分
  //   let data = {}
  //   data.customerUid = self.data.customerUid
  //   data.balanceIncrement = 0
  //   data.pointIncrement = self.data.getIntegral - self.data.costIntegral
  //   server.api(api.updateCustomerByCustomerUid, data, "post").then(function(res) {
  //     console.info(res)
  //     if (res.code == 0) {
  //       app.globalData.balance = res.data.balanceAfterUpdate
  //       app.globalData.point = res.data.pointAfterUpdate
  //     }
  //   })
  // },

  addOrderByState: function (state, tradeId) {
    var orderList = this.data.checkedGoodsList
    var address = this.data.checkedAddress
    var self = this
    var submitNum = 0

    let integral = 0
    let orderTemp = []
    for (let i in orderList) {
      orderTemp.push({})
      orderTemp[i].user_id = app.globalData.user_id
      orderTemp[i].open_id = app.globalData.openid
      orderTemp[i].item_id = orderList[i].item_id
      orderTemp[i].name = orderList[i].name
      orderTemp[i].image = orderList[i].image
      orderTemp[i].number = orderList[i].number
      if (orderList[i].isPanic) {
        orderTemp[i].single_price = orderList[i].panic_buying_price
      } else {
        orderTemp[i].single_price = orderList[i].price
      }
      orderTemp[i].postage = this.data.freightPrice
      orderTemp[i].state = state
      orderTemp[i].address_text = address.full_region + address.address
      orderTemp[i].tel = address.mobile
      orderTemp[i].receiver = address.name
      orderTemp[i].tradeId = tradeId
      if (orderList[i].integral_price <= 0) {
        orderTemp[i].have_cost_integral = 0
      } else if (orderList[i].integral_price > 0) {
        orderTemp[i].have_cost_integral = 1
      }
      orderTemp[i].integral_price = orderList[i].integral_price

      if (app.globalData.selectCard.id) {
        orderTemp[i].select_card_id = app.globalData.selectCard.id
        orderTemp[i].reduce_cost = app.globalData.selectCard.reduce_cost
      }
      orderTemp[i].disCountPrice = 0
      orderTemp[i].pay_state = 1

      // 备注
      orderTemp[i].note = this.data.note
    }

    if (orderTemp[0].select_card_id) {
      orderTemp = this.getAverageDisCountPrice(orderTemp)
    }

    for (let i in orderTemp) {
      var data = orderTemp[i]
      // data.user_id = app.globalData.user_id
      // data.open_id = app.globalData.openid
      // data.item_id = orderList[i].item_id
      // data.name = orderList[i].name
      // data.image = orderList[i].image
      // data.number = orderList[i].number
      // if (orderList[i].isPanic) {
      //   data.single_price = orderList[i].panic_buying_price
      // } else {
      //   data.single_price = orderList[i].price
      // }
      // data.postage = this.data.freightPrice
      // data.state = state
      // data.address_text = address.full_region + address.address
      // data.tel = address.mobile
      // data.receiver = address.name
      // data.tradeId = tradeId
      // if (orderList[i].integral_price <= 0) {
      //   data.have_cost_integral = 0
      // } else if (orderList[i].integral_price > 0) {
      //   data.have_cost_integral = 1
      // }
      // data.integral_price = orderList[i].integral_price

      // if (app.globalData.selectCard.id) {
      //   data.select_card_id = app.globalData.selectCard.id
      //   data.reduce_cost = app.globalData.selectCard.reduce_cost
      // }

      // data.pay_state = 1

      // 积分
      integral += Number(data.number) * Number(data.single_price)

      server.api(api.submitOrder, data, "post").then(function (res) {
        // console.info(res)
        wx.hideLoading()
        if (res.text == "添加订单成功") {
          submitNum++
          if (submitNum == orderList.length) {
            // 修改积分 去除余额支付积分 ver.1.0.18
            let reduce_cost = 0
            if (app.globalData.selectCard.id) {
              reduce_cost = app.globalData.selectCard.reduce_cost
            }
            integral = integral - reduce_cost + data.postage
            let dataI = {
              // integral: (-integral) + Number((integral / 100).toFixed(2)),
              // integral: (-integral) + Number((integral / 20).toFixed(2)),
              integral: -integral,
              user_id: app.globalData.user_id
            }
            server.api(api.updateIntegral, dataI, "post").then(function (res) {

            })

            let trid = {
              tradeId: data.tradeId
            }
            server.api(api.ylyPrintOrder, trid, "post").then(function (res) {

            })

            // 跳转显示订单状态
            app.globalData.payInfo.address = address
            app.globalData.payInfo.state = 2
            app.globalData.payInfo.actualPrice = self.data.actualPrice

            wx.redirectTo({
              url: '../../payResult/payResult',
            })
          }
        } else {
          wx.showModal({
            title: '下单失败',
            showCancel: false,
          })
        }
      })
    }
  }
})