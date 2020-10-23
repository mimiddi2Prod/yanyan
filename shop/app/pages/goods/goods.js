var app = getApp();
// var WxParse = require('../../lib/wxParse/wxParse.js');
var server = require('../../utils/server.js');
var api = require('../../config/api.js');
var util = require('../../utils/util.js')

Page({
  data: {
    showLoginDialog: false,
    id: 0,
    goods: null,
    // gallery: [],
    // attribute: [],
    // issueList: [{
    //   id: 1,
    //   question: 'sda',
    //   answer: 'dwd'
    // }],
    // review: [],
    // brand: {},
    // specificationList: [],
    // goodsPriceAndStock: '',
    // checkedPrice: '',
    // checkedStock: '',
    // checkedImg: '',
    // checkedParamIdList: [],

    // productList: [],
    // relatedGoods: [],
    cartGoodsCount: 0,
    // userHasCollect: 0,
    number: 1,
    // checkedSpecText: '请选择规格数量',
    // openAttr: false,
    // noCollectImage: "../../images/icon_collect.png",
    // hasCollectImage: "../../images/icon_collect_checked.png",
    // collectBackImage: "../../images/icon_collect.png"
  },

  // 限时抢购
  panic: function () {
    let self = this
    let current_time = new Date()
    let date = current_time.getFullYear() + '/' + (current_time.getMonth() + 1) + '/' + current_time.getDate() + ' '
    let hms = current_time.getHours() + ':' + current_time.getMinutes() + ':' + current_time.getSeconds()
    // self.data.goods.willPanic = false
    // for (let i in self.data.panicBuying) {
    if (self.data.goods.end_time > hms && self.data.goods.start_time <= hms) {
      self.data.goods.isPanic = true
    } else {
      self.data.goods.isPanic = false
    }
    if (!self.data.goods.panic_buying_id) {
      self.data.goods.isPanic = false
    }
    self.setData(self.data)

    // for (let i in self.data.panicBuying) {
    if (self.data.goods.start_time <= hms && self.data.goods.end_time > hms) {
      // self.data.current_panicBuying = self.data.goods

      var currentTime = new Date().getTime()
      var endTime = new Date(date + self.data.goods.end_time).getTime()
      var time = endTime - currentTime
      let h = '00',
        m = '00',
        s = '00',
        remainder
      self.data.goods.interval = setInterval(() => {
        if (time <= 0) {
          clearInterval(self.data.goods.interval)
          self.data.goods.interval = ''
          self.data.goods.isPanic = false
          // self.data.goods = {}
          self.setData(self.data)
          // self.panic()
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
          self.data.goods.time = h + ':' + m + ':' + s
          self.setData(self.data)
        }
      }, 1000)
      // break
    } else if (self.data.goods.start_time > hms) {
      var currentTime = new Date().getTime()
      var startTime = new Date(date + self.data.goods.start_time).getTime()
      var time = startTime - currentTime
      let h = '00',
        m = '00',
        s = '00',
        remainder
      self.data.goods.interval = setInterval(() => {
        if (time <= 0) {
          clearInterval(self.data.goods.interval)
          self.data.goods.interval = ''
          self.data.goods.willPanic = false
          // self.data.goods = {}
          self.setData(self.data)
          self.panic()
        } else {
          self.data.goods.willPanic = true
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
          self.data.goods.time = h + ':' + m + ':' + s
          self.setData(self.data)
        }
      }, 1000)
    }
    // }
  },

  previewImage: function (e) {
    // 去除图片预览
    return;
    let index = e.currentTarget.dataset.index,
      list = e.currentTarget.dataset.list
    wx.previewImage({
      urls: list,
      current: list[index]
    })
  },
  getGoodsInfo: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var self = this
    server.api(api.goodsInfo, {
      itemId: this.data.id
    }, "post").then(function (res) {
      // console.info(res)
      wx.hideLoading()
      res.imageB = []
      for (let i in res.image) {
        res.imageB[i] = res.image[i] + "?imageView2/2/w/800/h/800"
      }
      res.goods_infoI = []
      for (let i in res.goods_info) {
        res.goods_infoI[i] = res.goods_info[i] + "?imageView2/2/w/800/h/800"
      }
      // for (let i in res.specification) {
      //   for (let j in res.specification[i].paramList) {
      //     if (res.specification[i].paramList[j].image.length > 0) {
      //       res.specification[i].paramList[j].imageC = res.specification[i].paramList[j].image + "?imageView2/0/w/300/h/300"
      //     }
      //   }
      // }

      // if (res.best_review) {
      //   res.best_review[0].user_name = decodeURIComponent(res.best_review[0].user_name)
      //   res.best_review[0].text = decodeURIComponent(res.best_review[0].text)
      //   res.best_review[0].create_time = util.formatTime(new Date(res.best_review[0].create_time))
      //   res.best_review[0].imageR = []
      //   for (let i in res.best_review[0].image) {
      //     res.best_review[0].imageR[i] = res.best_review[0].image[i] + "?imageView2/0/w/300/h/300"
      //   }
      //   self.setData({
      //     review: res.best_review[0],
      //   })
      // }
      self.setData({
        goods: res,
        // specificationList: res.specification
      })

      // self.getPrice()
      self.panic()
    })
  },

  // changeSpecInfo: function() {
  //   // 获取选中参数信息
  //   let checkedNameValue = this.getCheckedSpecValue();
  //   //设置选择的信息
  //   // 获取选中参数的数组
  //   let checkedValue = checkedNameValue.filter(function(v) {
  //     if (v.valueId != 0) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }).map(function(v) {
  //     return v.valueText;
  //   });
  //   if (checkedValue.length > 0) {
  //     this.setData({
  //       'checkedSpecText': checkedValue.join('　')
  //     });
  //   } else {
  //     this.setData({
  //       'checkedSpecText': '请选择规格数量'
  //     });
  //   }
  // },

  // changeSpecPriceAndStock: function() {
  //   // 获取选中参数信息
  //   let checkedNameValue = this.getCheckedSpecValue();
  //   //设置选择的信息
  //   // 获取选中参数的数组
  //   let checkedId = checkedNameValue.filter(function(v) {
  //     if (v.valueId != 0) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }).map(function(v) {
  //     return v.valueId;
  //   });

  //   if (checkedId.length == this.data.specificationList.length) {
  //     for (let j in this.data.goodsPriceAndStock) {
  //       if (checkedId[0] == this.data.goodsPriceAndStock[j].param_id_1 && checkedId[1] == this.data.goodsPriceAndStock[j].param_id_2) {
  //         this.setData({
  //           'checkedPrice': this.data.goodsPriceAndStock[j].price,
  //           'checkedStock': this.data.goodsPriceAndStock[j].stock
  //         });
  //       }
  //     }
  //   } else {
  //     this.setData({
  //       'checkedPrice': '',
  //       'checkedStock': ''
  //     });
  //   }
  // },

  // getCheckedProductItem: function(key) {
  //   return this.data.productList.filter(function(v) {
  //     if (v.goods_specification_ids == key) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // },
  onLoad: function (options) {
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      let id = scene.split('=')[1]
      this.setData({
        id: parseInt(options.id)
      });
    };

    // 页面初始化 options为页面跳转所带来的参数
    if (options.id) {
      this.setData({
        id: parseInt(options.id)
      });
    }

    var self = this;
    this.getGoodsInfo();

    this.getCartTotal();
    // this.getIntegral();
    // let Inter = setInterval(() => {
    //   if (self.data.goods) {
    //     clearInterval(Inter)
    //     self.draw()
    //   }
    // }, 500)
  },
  /**
   * 未使用的代码，原计划分享页面底部赋予价格标签
   * 因图片需要https才能下载使用，故舍弃
   */
  draw() {
    let self = this,
      calcWidthRatio = wx.getSystemInfoSync().windowWidth / 375
    const ctx = wx.createCanvasContext('canvas')
    ctx.beginPath();
    ctx.rect(0, 250 * calcWidthRatio, 230 * calcWidthRatio, 50 * calcWidthRatio)
    ctx.setFillStyle('#fff')
    ctx.fill()
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(230 * calcWidthRatio, 250 * calcWidthRatio, 375 * calcWidthRatio, 50 * calcWidthRatio)
    ctx.setFillStyle('#F5BF4C')
    ctx.fill()
    ctx.closePath();

    ctx.setFontSize(16)
    ctx.setFillStyle('black')
    let price = "￥ " + (self.data.panic_buying_price ? self.data.panic_buying_price : self.data.goods.price)
    ctx.fillText(price, 30 * calcWidthRatio, 285 * calcWidthRatio);

    ctx.setFontSize(18)
    ctx.fillText("立即抢购", 267 * calcWidthRatio, 282 * calcWidthRatio);

    // 商品图片
    wx.getImageInfo({
      src: self.data.goods.image[0] + "?imageView2/5/w/750/h/500",
      success: function (res) {
        // 图片路径
        let imgPath = res.path
        // 绘制logo
        // ctx.clip();
        ctx.drawImage(imgPath, 0, 0, 375 * calcWidthRatio, 250 * calcWidthRatio)//未调用clip方法
        ctx.restore();
        ctx.save()
        ctx.draw()

        drawBottom()
      }
    })
    function drawBottom() {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 750 * calcWidthRatio,
          height: 600 * calcWidthRatio,
          destWidth: 750,
          destHeight: 600,
          canvasId: 'canvas',
          success: function (res) {
            self.setData({
              temp: res.tempFilePath,
              hide: true
            })
          }
        })
      }, 500)
    }
  },

  // getIntegral: function() {
  //   let self = this
  //   server.api(api.getIntegral, {
  //     user_id: app.globalData.user_id,
  //   }, "post").then(function(res) {
  //     if (res.length > 0) {
  //       app.globalData.integral = res[0].integral
  //     }
  //   })
  // },

  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  // 弹出隐藏选择规格
  // switchAttrPop: function() {
  //   if (this.data.openAttr == false) {
  //     this.setData({
  //       openAttr: !this.data.openAttr
  //     });
  //   }
  // },
  // 弹出隐藏选择规格
  // closeAttr: function() {
  //   this.setData({
  //     openAttr: false,
  //   });
  // },
  // addCannelCollect: function() {
  //   let self = this;
  //   //添加或是取消收藏
  //   util.request(api.CollectAddOrDelete, {
  //       typeId: 0,
  //       valueId: this.data.id
  //     }, "POST")
  //     .then(function(res) {
  //       let _res = res;
  //       if (_res.errno == 0) {
  //         if (_res.data.type == 'add') {
  //           self.setData({
  //             'collectBackImage': self.data.hasCollectImage
  //           });
  //         } else {
  //           self.setData({
  //             'collectBackImage': self.data.noCollectImage
  //           });
  //         }

  //       } else {
  //         wx.showToast({
  //           image: '../../images/icon_error.png',
  //           title: _res.errmsg,
  //           mask: true
  //         });
  //       }
  //     });
  // },
  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
    // wx.navigateTo({
    //   url: '/pages/cart/goodsToCart',
    // })
  },
  addToCart: function () {
    var self = this;
    // 这边需要写一个判断是否注册过
    // 如果没有 需要跳转 写有登录按钮的页面去登录
    if (app.globalData.user_id == '' || !app.globalData.userInfo) {
      this.loginDialog()
      return
    }

    // if (this.data.goods.group_id > 0) {
    //   if (this.data.goods.founded == 1) {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '拼团已结束',
    //       mask: true
    //     });
    //     return false;
    //   }
    // }

    // if (this.data.openAttr === false) {
    //   //打开规格选择窗口
    //   this.setData({
    //     openAttr: !this.data.openAttr
    //   });
    // } else {

    // //提示选择完整规格
    // if (!this.isCheckedAllSpec()) {
    //   wx.showToast({
    //     image: '../../images/icon_error.png',
    //     title: '请选择规格',
    //     mask: true
    //   });
    //   return false;
    // }

    // var addCartInfo = this.data.goodsPriceAndStock.filter(function(goodsres) {
    //   if (goodsres.param_id_1 == self.data.checkedParamIdList[0] && goodsres.param_id_2 == self.data.checkedParamIdList[1]) {
    //     return goodsres
    //   }
    // })
    // console.info(this.data.goods)
    var addCartInfo = this.data.goods
    if (self.data.number > addCartInfo.stock) {
      wx.showToast({
        // image: '../../images/icon_error.png',
        icon: "none",
        title: '库存不足',
        duration: 1000,
        mask: true
      });
      return false;
    }

    //添加到购物车
    server.api(api.addCart, {
      user_id: app.globalData.user_id,
      item_id: addCartInfo.id,
      // param_id_1: addCartInfo[0].param_id_1,
      // param_id_2: addCartInfo[0].param_id_2,
      number: this.data.number
    }, "POST")
      .then(function (res) {
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
          self.getCartTotal()
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

  getCartTotal: function () {
    var self = this
    server.api(api.getCart, {
      user_id: app.globalData.user_id
    }, "post").then(function (res) {
      let cartGoodsCount = 0
      res.forEach(function (e) {
        cartGoodsCount += e.number
      })
      self.setData({
        cartGoodsCount: cartGoodsCount
      })
    })
  },

  // toSettlement: function() {
  //   var self = this;
  //   if (app.globalData.user_id == '') {
  //     this.loginDialog()
  //     return
  //   }

  //   if (this.data.goods.group_id > 0) {
  //     if (this.data.goods.founded == 1) {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '拼团已结束',
  //         mask: true
  //       });
  //       return false;
  //     }
  //   }

  //   if (this.data.openAttr === false) {
  //     //打开规格选择窗口
  //     this.setData({
  //       openAttr: !this.data.openAttr
  //     });
  //   } else {
  //     //提示选择完整规格
  //     if (!this.isCheckedAllSpec()) {
  //       wx.showToast({
  //         image: '../../images/icon_error.png',
  //         title: '请选择规格',
  //         mask: true
  //       });
  //       return false;
  //     }

  //     var goodsInfo = this.data.goodsPriceAndStock.filter(function(goodsres) {
  //       if (goodsres.param_id_1 == self.data.checkedParamIdList[0] && goodsres.param_id_2 == self.data.checkedParamIdList[1]) {
  //         return goodsres
  //       }
  //     })

  //     if (self.data.number > goodsInfo[0].stock) {
  //       wx.showToast({
  //         image: '../../images/icon_error.png',
  //         title: '库存不足',
  //         mask: true
  //       });
  //       return false;
  //     }

  //     let costIntegral = this.data.number * this.data.goods.integral_price
  //     if (app.globalData.point < costIntegral) {
  //       wx.showToast({
  //         title: '购买商品所需积分不足',
  //         icon: 'none',
  //         mask: true
  //       });
  //       return false;
  //     };

  //     goodsInfo[0].number = this.data.number
  //     goodsInfo[0].item_id = this.data.goods.id
  //     goodsInfo[0].name = this.data.goods.name
  //     goodsInfo[0].describe = this.data.goods.describe
  //     goodsInfo[0].integral_price = this.data.goods.integral_price
  //     goodsInfo[0].item_param_id_1 = goodsInfo[0].param_id_1
  //     goodsInfo[0].item_param_id_2 = goodsInfo[0].param_id_2
  //     for (let i in this.data.specificationList[0].paramList) {
  //       if (this.data.specificationList[0].paramList[i].id == goodsInfo[0].param_id_1) {
  //         goodsInfo[0].param_1 = this.data.specificationList[0].paramList[i].param
  //         if (this.data.specificationList[0].paramList[i].image) {
  //           goodsInfo[0].image = this.data.specificationList[0].paramList[i].image
  //           goodsInfo[0].imageC = this.data.specificationList[0].paramList[i].imageC
  //         }
  //       }
  //     }
  //     for (let i in this.data.specificationList[1].paramList) {
  //       if (this.data.specificationList[1].paramList[i].id == goodsInfo[0].param_id_2) {
  //         goodsInfo[0].param_2 = this.data.specificationList[1].paramList[i].param
  //         if (this.data.specificationList[1].paramList[i].image) {
  //           goodsInfo[0].image = this.data.specificationList[1].paramList[i].image
  //           goodsInfo[0].imageC = this.data.specificationList[1].paramList[i].imageC
  //         }
  //       }
  //     }

  //     app.globalData.orderList = goodsInfo
  //     // console.info(app.globalData.orderList)
  //     wx.navigateTo({
  //       url: '../shopping/checkout/checkout',
  //     })
  //   }
  // },
  // cutNumber: function() {
  //   this.setData({
  //     number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
  //   });
  // },
  // addNumber: function() {
  //   var stock = 1
  //   if (this.data.checkedParamIdList.length == this.data.specificationList.length) {
  //     for (let i in this.data.goodsPriceAndStock) {
  //       if (this.data.goodsPriceAndStock[i].param_id_1 == this.data.checkedParamIdList[0] && this.data.goodsPriceAndStock[i].param_id_2 == this.data.checkedParamIdList[1]) {
  //         stock = this.data.goodsPriceAndStock[i].stock
  //       }
  //     }
  //   }
  //   this.setData({
  //     number: (this.data.number + 1 <= stock) ? this.data.number + 1 : stock
  //   });
  // },

  // 注册
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
              //   success: function(e) {
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let price = this.data.goods.isPanic ? " 限时抢购￥" + this.data.goods.panic_buying_price : " ￥" + this.data.goods.price
    return {
      title: this.data.goods.name + price,
      // title: '岩岩到家线上超市 又好又快',
      // imageUrl: this.data.temp,
      path: '/pages/goods/goods?id=' + this.data.id
    }
  }
})