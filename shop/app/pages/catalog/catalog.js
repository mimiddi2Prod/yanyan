var server = require('../../utils/server.js');
var api = require('../../config/api.js');

// 贝塞尔曲线动效
// var busPos, finger
const app = getApp()
Page({
  data: {
    activeId: '',
    checkedAllNumber: 0,
    showLoginDialog: false,
    number: 1,

    pGoods: [],

    // 购物车贝塞尔曲线动效
    // hide_good_box: true,
    // animation: {}
    isFly: false,
    top: -100
  },

  showGoodsDetail: function (e) {
    wx.navigateTo({
      url: '../goods/goods?id=' + e.currentTarget.dataset.id,
    })
  },
  onLoad: function (options) {
    // 版本变更 
    console.info(options)
    if (options.id) {
      this.setData({
        linkId: options.id,
        parent_id: options.parent_id
      })
    }
    this.setWinHeight()
    this.category()
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
          winHeight: calc - 90,
          winCartHeightInit: calc - 170,
          winWidth: clientWidth
        });
      }
    });
  },

  category: function () {
    var self = this
    server.api(api.category, { parent_id: this.data.parent_id }, "post").then(function (res) {
      console.info(res)
      if (res.category && res.category.length > 0) {
        self.data.categories = res.category.map(function (eData) {
          eData.scrollId = 's' + eData.id
          return eData
        })
        // 初始加载默认第一个类别为选中状态
        if (self.data.activeId.length <= 0) {
          self.data.activeId = 's' + res.category[0].id
          // self.data.activeName = res.category[0].name
        }
      }
      if (res.goods && res.goods.length > 0) {
        // 每个商品加入购物车的数量
        // console.info(res.goods)
        for (let i in res.goods) {
          // res.goods[i].cartNumber = 0
          // res.goods[i].isSearch = false
          res.goods[i].image = res.goods[i].image + "?imageView2/2/w/400/h/400"
        }
        let goods = []
        // 相同类别的商品放到筛选放一起
        for (let i in self.data.categories) {
          goods.push({
            category_id: self.data.categories[i].id,
            scrollId: 's' + self.data.categories[i].id,
            category_name: self.data.categories[i].name,
            list: res.goods.filter(function (e) {
              return e.category_id_1 == self.data.categories[i].id
            })
          })
          // console.info(goods)
        }

        goods.forEach(m => {
          for (let i = 0; i < m.list.length - 1; i++) {
            for (let j = 0; j < m.list.length - 1 - i; j++) {
              if (m.list[j].stock <= 0) {
                let temp = m.list[j]
                m.list[j] = m.list[j + 1]
                m.list[j + 1] = temp
              }
            }
          }
          // m.list.forEach((n, index) => {
          //   for (let j = 1; j < m.list.length - 1 - index; j++) {
          //     if (n.stock <= 0) {
          //       let temp = m.list[j]
          //       m.list[j] = n
          //       n = temp
          //     }
          //   }
          //   // 库存为0，放后面
          //   // if (n.stock <= 0) {
          //   //   let temp = m.list[i]
          //   //   m.list[i] = n
          //   //   n = temp
          //   //   i++
          //   //   // m.list.splice(index, 1)
          //   //   // m.list.push(temp)
          //   // }
          // })
        })

        // 所有商品
        self.data.goods = goods
      }
      self.setData(self.data)

      // 版本变更
      // if (app.globalData.catalogid) {
      if (self.data.linkId) {
        self.categoryClick = true;
        self.setData({
          activeId: 's' + self.data.linkId,
          goodsToView: 's' + self.data.linkId,
        })
        // app.globalData.catalogid = ''
      }

      self.waterpanic()
    })
  },

  waterpanic: function () {
    let self = this
    let cpb = app.globalData.current_panicBuying,
      pGoods = []
    // console.info(cpb)
    if (cpb) {
      if (cpb.list.length) {
        for (let i in cpb.list) {
          pGoods.push(cpb.list[i].id)
        }
      }

      let current_time = new Date()
      let date = current_time.getFullYear() + '/' + (current_time.getMonth() + 1) + '/' + current_time.getDate() + ' '
      var currentTime = new Date().getTime()
      var endTime = new Date(date + cpb.end_time).getTime()
      var time = endTime - currentTime
      // console.info(n)
      // console.info(time)
      if (time > 0) {
        setTimeout(() => {
          self.waterpanic()
        }, time)
      } else {
        setTimeout(() => {
          self.waterpanic()
        }, 1000)
      }
    } else {
      setTimeout(() => {
        self.waterpanic()
      }, 2000)
    }
    // console.info(pGoods)
    this.setData({
      pGoods: pGoods
    })
  },

  // waterpanic: function() {
  //   let self = this
  //   let current_time = new Date()
  //   let date = current_time.getFullYear() + '/' + (current_time.getMonth() + 1) + '/' + current_time.getDate() + ' '
  //   let hms = (current_time.getHours() < 10 ? '0' + current_time.getHours() : current_time.getHours()) +
  //     ':' + (current_time.getMinutes() < 10 ? '0' + current_time.getMinutes() : current_time.getMinutes()) +
  //     ':' + (current_time.getSeconds() < 10 ? '0' + current_time.getSeconds() : current_time.getSeconds())

  //   let flag = 0,
  //     havePanic = false
  //   for (let j in self.data.goods) {
  //     let waterfallList = self.data.goods[j].list
  //     // console.info(waterfallList)
  //     for (let i in waterfallList) {
  //       waterfallList[i].isPanic = false
  //       if (waterfallList[i].panic_buying_id) {
  //         havePanic = true
  //         console.info(hms)
  //         console.info(waterfallList[i].start_time)
  //         console.info(waterfallList[i].end_time)
  //         if (waterfallList[i].start_time <= hms && waterfallList[i].end_time > hms) {
  //           var currentTime = new Date().getTime()
  //           var endTime = new Date(date + waterfallList[i].end_time).getTime()
  //           var time = endTime - currentTime
  //           let h = '00',
  //             m = '00',
  //             s = '00',
  //             remainder
  //           // waterfallList[i].interval = setInterval(() => {
  //           //   if (time <= 0) {
  //           //     clearInterval(waterfallList[i].interval)
  //           //     waterfallList[i].interval = ''
  //           //     // waterfallList[i] = {}
  //           //     waterfallList[i].isPanic = false
  //           //     self.data.goods[j].list = waterfallList
  //           //     self.setData(self.data)
  //           //     self.waterpanic()
  //           //   } else {
  //           //     time = time - 1000
  //           //     let ex = (time / 1000) >> 0
  //           //     h = (ex / 3600) >> 0
  //           //     h = h < 10 ? '0' + h : h
  //           //     remainder = ex % 3600
  //           //     if (remainder > 0) {
  //           //       m = (remainder / 60) >> 0
  //           //       m = m < 10 ? '0' + m : m
  //           //       remainder = remainder % 60
  //           //       if (remainder > 0) {
  //           //         s = remainder
  //           //         s = s < 10 ? '0' + s : s
  //           //       }
  //           //     }
  //           //     // waterfallList[i].time = h + ':' + m + ':' + s
  //           //     waterfallList[i].isPanic = true
  //           //     self.data.goods[j].list = waterfallList
  //           //     self.setData(self.data)
  //           //     // console.info(self.data.waterfallGoods)
  //           //   }
  //           // }, 1000)
  //           console.info(time)
  //           if (time <= 0) {
  //             // clearInterval(waterfallList[i].interval)
  //             // waterfallList[i].interval = ''
  //             // // waterfallList[i] = {}
  //             waterfallList[i].isPanic = false
  //             self.data.goods[j].list = waterfallList
  //             self.setData(self.data)
  //             self.waterpanic()
  //             console.info(11111111111111)
  //           } else {
  //             // time = time - 1000
  //             // let ex = (time / 1000) >> 0
  //             // h = (ex / 3600) >> 0
  //             // h = h < 10 ? '0' + h : h
  //             // remainder = ex % 3600
  //             // if (remainder > 0) {
  //             //   m = (remainder / 60) >> 0
  //             //   m = m < 10 ? '0' + m : m
  //             //   remainder = remainder % 60
  //             //   if (remainder > 0) {
  //             //     s = remainder
  //             //     s = s < 10 ? '0' + s : s
  //             //   }
  //             // }
  //             setTimeout(() => {
  //               self.waterpanic()
  //             }, time)
  //             // console.info(h + ':' + m + ':' + s)
  //             waterfallList[i].isPanic = true
  //             self.data.goods[j].list = waterfallList
  //             self.setData(self.data)
  //             console.info(2222222222)
  //           }
  //         } else {
  //           console.info(33333)
  //           flag++
  //           let num = 0
  //           for (let j in self.data.goods) {
  //             for (let i in self.data.goods[j].list) {
  //               self.data.goods[j].list[i].isPanic = false
  //               if (self.data.goods[j].list[i].panic_buying_id) {
  //                 num++
  //               }
  //             }
  //           }
  //           self.setData(self.data)
  //           var currentTime = new Date().getTime()
  //           var endTime = new Date(date + waterfallList[i].end_time).getTime()
  //           var time = endTime - currentTime
  //           let h = '00',
  //             m = '00',
  //             s = '00',
  //             remainder
  //           if (flag == num && havePanic) {
  //             setTimeout(() => {
  //               self.waterpanic()
  //             }, time)
  //           }
  //         }
  //       }
  //     }
  //   }
  // },

  // 类别切换 对应的商品展示跟着类别切换
  onCategoryClick: function (e) {
    let id = e.currentTarget.dataset.id;
    this.categoryClick = true;
    this.setData({
      goodsToView: id,
      activeId: id,
    })
  },

  scroll: function (e) {
    if (this.categoryClick) {
      this.categoryClick = false;
      return;
    }
    // console.info(e)
    let scrollTop = e.detail.scrollTop;
    let offset = 0;
    let isBreak = false;
    // 将内容置顶
    // if (scrollTop > 0 && e.detail.deltaY < 0) {
    //   wx.pageScrollTo({
    //     scrollTop: 290,
    //     duration: 0
    //   })
    // }
    // if (scrollTop <= 6 && e.detail.deltaY > 0) {
    //   wx.pageScrollTo({
    //     scrollTop: 0,
    //   })
    // }

    for (let g = 0; g < this.data.goods.length; g++) {
      let goodWrap = this.data.goods[g];
      offset += 40;

      if (scrollTop <= offset) {
        if (this.data.categoryToView != goodWrap.scrollId) {
          this.setData({
            activeId: goodWrap.scrollId,
            categoryToView: goodWrap.scrollId,
          })
        }
        break;
      }

      for (let i = 0; i < goodWrap.list.length; i++) {
        // offset += 90;
        // offset += 111;
        offset += 121;
        if (scrollTop <= offset) {
          if (this.data.categoryToView != goodWrap.scrollId) {
            this.setData({
              activeId: goodWrap.scrollId,
              categoryToView: goodWrap.scrollId,
            })
          }
          isBreak = true;
          break;
        }
      }

      if (isBreak) {
        break;
      }
    }
  },


  getCartList: function () {
    var self = this
    server.api(api.getCart, {
      user_id: app.globalData.user_id
    }, "post").then(function (res) {
      // console.info(res)
      wx.hideLoading({})
      let checkedAllNumber = 0
      if (res.length > 0) {
        for (let i in res) {
          // res[i].checked = false
          // res[i].price = Number(res[i].price).toFixed(2)
          // res[i].imageC = res[i].image + "?imageView2/0/w/300/h/300"
          checkedAllNumber = checkedAllNumber + res[i].number
        }
      }
      // if (res.length != self.data.cartGoods.length || app.globalData.refreshCart) {

      self.setData({
        // cartGoods: res,
        // isEditCart: false,
        // checkedAllStatus: false,
        // checkedAllPrice: 0.00,
        checkedAllNumber: checkedAllNumber,
        // cartList:res
      })
      // app.globalData.refreshCart = false
      // }

      // 数量
      // let Interval = setInterval(() => {
      //   if (checkedAllNumber > 0 && self.data.goods.length) {
      //     let goods = self.data.goods
      //     clearInterval(Interval)
      //     goods.forEach(m => {
      //       m.list.forEach(n => {
      //         n.num = 0
      //         for (let i in res) {
      //           if (res[i].item_id == n.id) {
      //             n.num = res[i].number
      //           }
      //         }
      //       })
      //     });
      //     self.setData({
      //       goods: goods
      //     })
      //   } else {
      //     let goods = self.data.goods
      //     clearInterval(Interval)
      //     goods.forEach(m => {
      //       m.list.forEach(n => {
      //         n.num = 0
      //       })
      //     });
      //     self.setData({
      //       goods: goods
      //     })
      //   }
      // }, 1000)
    })
  },

  loginDialog: function () {
    this.setData({
      showLoginDialog: !this.data.showLoginDialog
    })
  },

  cuteToCart: function (e) {
    if (e.currentTarget.dataset.c_num == 0) {
      return
    }
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
      number: -1
    }, "POST").then(function (res) {
      if (res.text == "添加成功") {
        wx.showLoading({
          mask: true
        })
        app.globalData.refreshCart = true
        self.getCartList()
      }
    });
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
    // 贝塞尔曲线动效
    // this.touchOnGoods(e)
    if (this.data.isFly) {
      return;
    }

    //添加到购物车
    server.api(api.addCart, {
      user_id: app.globalData.user_id,
      item_id: e.currentTarget.dataset.id,
      number: this.data.number
    }, "POST")
      .then(function (res) {
        // console.info(res)
        // return
        if (res.text == "添加成功") {
          self._flyToCartEffect(e);
          // wx.showToast({
          //   title: '添加成功'
          // });
          wx.showLoading({
            mask: true
          })
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

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getCartList()
    // 版本变更 注释
    // if (app.globalData.catalogid && this.data.goods) {
    //   this.categoryClick = true;
    //   this.setData({
    //     activeId: 's' + app.globalData.catalogid,
    //     goodsToView: 's' + app.globalData.catalogid,
    //   })
    //   app.globalData.catalogid = ''
    // }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // onPullDownRefresh:function(){
  //   this.category()
  // },
  // switchCate: function(event) {
  //   var that = this;
  //   var currentTarget = event.currentTarget;
  //   if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
  //     return false;
  //   }
  //   // console.info(event)
  //   this.setData({
  //     sliderOffset: event.currentTarget.offsetTop,
  //     // currentId: event.currentTarget.dataset.id,
  //   })
  //   for (var i in this.data.navList) {
  //     if (this.data.navList[i].id == event.currentTarget.dataset.id) {
  //       this.setData({
  //         currentCategory: this.data.navList[i]
  //       })
  //       app.globalData.subCategory = this.data.currentCategory
  //     }
  //   }
  // }
  // 购物车贝塞尔曲线动效
  // touchOnGoods(e) {
  //   // busPos = { x: 150, y: 601 }; 控制落点
  //   busPos = { x: 10, y: 601 };
  //   // busPos.y = wx.getSystemInfoSync().windowHeight - 66;
  //   busPos.y = wx.getSystemInfoSync().windowHeight - 66;
  //   this.setData({
  //     animation: wx.createAnimation({
  //       timingFunction: "ease-in",
  //       delay: 0,
  //       duration: 1000
  //     })
  //   })
  //   // 如果good_box正在运动
  //   if (!this.data.hide_good_box) return;
  //   const { touches } = e;
  //   const topPoint = {};

  //   // this.finger = {
  //   finger = {
  //     x: touches[0].clientX,
  //     y: touches[0].clientY
  //   };

  //   topPoint['y'] =
  //     // this.finger['y'] < this.busPos['y']
  //     //   ? this.finger['y'] - 150
  //     //   : this.busPos['y'] - 150;
  //     finger['y'] < busPos['y']
  //       ? finger['y'] - 150
  //       : busPos['y'] - 150;

  //   topPoint['x'] =
  //     // this.finger['x'] > this.busPos['x']
  //     //   ? (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x']
  //     //   : (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
  //     finger['x'] > busPos['x']
  //       ? (finger['x'] - busPos['x']) / 2 + busPos['x']
  //       : (busPos['x'] - finger['x']) / 2 + finger['x'];

  //   // const result = bezier([this.finger, topPoint, this.busPos], 25);
  //   const result = bezier([finger, topPoint, busPos], 25);
  //   this.startAnimation(result);

  //   function bezier(points, part) {
  //     let sx = points[0]['x'];
  //     let sy = points[0]['y'];
  //     let cx = points[1]['x'];
  //     let cy = points[1]['y'];
  //     let ex = points[2]['x'];
  //     let ey = points[2]['y'];
  //     var bezier_points = [];
  //     // 起始点到控制点的x和y每次的增量
  //     var changeX1 = (cx - sx) / part;
  //     var changeY1 = (cy - sy) / part;
  //     // 控制点到结束点的x和y每次的增量
  //     var changeX2 = (ex - cx) / part;
  //     var changeY2 = (ey - cy) / part;
  //     //循环计算
  //     for (var i = 0; i <= part; i++) {
  //       // 计算两个动点的坐标
  //       var qx1 = sx + changeX1 * i;
  //       var qy1 = sy + changeY1 * i;
  //       var qx2 = cx + changeX2 * i;
  //       var qy2 = cy + changeY2 * i;
  //       // 计算得到此时的一个贝塞尔曲线上的点
  //       var lastX = qx1 + ((qx2 - qx1) * i) / part;
  //       var lastY = qy1 + ((qy2 - qy1) * i) / part;
  //       // 保存点坐标
  //       var point = {};
  //       point['x'] = lastX;
  //       point['y'] = lastY;
  //       bezier_points.push(point);
  //     }
  //     //console.log(bezier_points)
  //     return {
  //       bezier_points
  //     };
  //   }

  // },
  // startAnimation(linePos) {
  //   let self = this
  //   const { bezier_points } = linePos;
  //   const len = bezier_points.length - 1;
  //   const first = bezier_points.shift();
  //   //防止动画不生效
  //   //同一个按钮动画，动画开始前先归位元素位置
  //   this.setData(
  //     {
  //       hide_good_box: false,
  //       initLeft: first.x,
  //       initTop: first.y,
  //       // animationData: this.animation.export()
  //       animationData: this.data.animation.export()
  //     },
  //     () => {
  //       // bezier_points.forEach((i, idx) => {
  //       //   this.animation
  //       //     .left(i.x)
  //       //     .top(i.y)
  //       //     .rotate(50)
  //       //     .step({ duration: 25 });
  //       // });
  //       // this.setData({
  //       //   animationData: this.animation.export()
  //       // });
  //       // console.info(bezier_points)
  //       bezier_points.forEach((i, idx) => {
  //         // console.info(i.x,i.y)
  //         self.data.animation
  //           .left(i.x)
  //           .top(i.y)
  //           .rotate(50)
  //           .step({ duration: 25 });
  //       });
  //       self.setData({
  //         // animationData: animation.export()
  //         animationData: self.data.animation.export()
  //       });
  //     }
  //   );
  //   //有个bug，就是连续点击，动画不出来
  //   setTimeout(() => {
  //     this.setData({ hide_good_box: true });
  //     self.data.animation
  //       .left(bezier_points[0].x)
  //       .top(bezier_points[0].y)
  //       .rotate(50)
  //       .step({ duration: 25 });
  //     self.setData({
  //       // animationData: animation.export()
  //       animationData: self.data.animation.export()
  //     });
  //   }, len * 20 + 100);
  // },
  /*加入购物车动效*/
  _flyToCartEffect: function (events) {
    this.setData({
      top:events.touches[0].clientY,
      left:events.touches[0].clientX
    })
    let self = this
    let Interval = setInterval(() => {
      if(self.data.top != -100){
        clearInterval(Interval)
        //获得当前点击的位置，距离可视区域左上角
        var touches = events.touches[0];
        console.info(wx.getSystemInfoSync())
        var sys = wx.getSystemInfoSync(),rpx = 750/sys.windowWidth
        var diff = {
          // x: '25px',
          // x: '-450px',
          x: '-365px',
          // x: '-900rpx',
          // y: app.globalData.hh -touches.clientY-40 + 'px'//向下
          // y: 25- touches.clientY  + 'px'//向上
          // y: 750/wx.getSystemInfoSync().windowWidth* wx.getSystemInfoSync().windowHeight/1.5 - (touches.clientY*1.2) + 'px'//向下
          // y: rpx * wx.getSystemInfoSync().windowHeight - (touches.clientY*rpx) + Math.sqrt(2*rpx* wx.getSystemInfoSync().windowHeight /touches.clientY) + 'rpx'//向下
          y: rpx * wx.getSystemInfoSync().windowHeight - (touches.clientY*rpx) -140 + 'rpx'//向下
          // y:  wx.getSystemInfoSync().windowHeight - touches.clientY + Math.sqrt(10* wx.getSystemInfoSync().windowHeight /touches.clientY) + 'px'//向下
        },
          // style = 'display: block;-webkit-transform:translate(' + diff.x + ',' + diff.y + ') rotate(350deg) scale(0)';  //移动距离
          style = 'display: block;-webkit-transform:translate(' + diff.x + ',' + diff.y + ')';  //移动距
          console.info(self.data.top,diff)
        self.setData({
          isFly: true,
          translateStyle: style
        });
        // var that = this;
        setTimeout(() => {
          self.setData({
            isFly: false,
            translateStyle: '-webkit-transform: none;',  //恢复到最初状态
            isShake: true,
            top:-100
          });
          setTimeout(() => {
            var counts = self.data.cartTotalCounts + self.data.productCounts;
            self.setData({
              isShake: false,
              cartTotalCounts: counts
            });
          }, 200);
        }, 500);
            }
    }, 50);
  },
})