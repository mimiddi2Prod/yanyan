// pages/search/search.js
// var util = require('../../utils/util.js');
// var api = require('../../config/api.js');
var server = require('../../utils/server.js');
var api = require('../../config/api.js');
const pinyin = require('../../utils/pinyin.js')

var app = getApp()
Page({
  data: {
    // keywrod: '',
    showLoginDialog: false,
    searchStatus: false,
    goodsList: [],
    searchList: [],
    // helpKeyword: [],
    // historyKeyword: [],
    // categoryFilter: false,
    // currentSortType: 'default',
    // currentSortOrder: '',
    // filterCategory: [],
    // defaultKeyword: {},
    // hotKeyword: [],
    // page: 1,
    // size: 20,
    // currentSortType: 'id',
    // currentSortOrder: 'desc',
    // categoryId: 0
    searchkeyword: [],
  },
  //事件处理函数
  closeSearch: function () {
    wx.navigateBack()
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      // searchStatus: false
    });
  },
  onLoad: function () {

    // this.getSearchKeyword();
    this.getGoodsList()

    let searchkeyword = wx.getStorageSync('search')
    // console.info(searchkeyword)
    if (!searchkeyword) {
      searchkeyword = []
    }
    this.setData({
      searchkeyword: searchkeyword
    })
  },

  // getSearchKeyword() {
  //   let that = this;
  //   // util.request(api.SearchIndex).then(function (res) {
  //   var res = { "errno": 0, "errmsg": "", "data": { "defaultKeyword": { "keyword": "520元礼包抢先领", "is_hot": 1, "is_default": 1, "is_show": 1, "sort_order": 1, "scheme _url": "", "id": 1, "type": 0 }, "historyKeywordList": ["520元礼包抢先领", "新品上市", "墨镜", "夏凉被"], "hotKeywordList": [{ "keyword": "520元礼包抢先领", "is_hot": 1 }, { "keyword": "母亲节", "is_hot": 0 }, { "keyword": "日式", "is_hot": 0 }, { "keyword": "新品上市", "is_hot": 0 }, { "keyword": "墨镜", "is_hot": 0 }, { "keyword": "夏凉被", "is_hot": 0 }, { "keyword": "单鞋", "is_hot": 0 }] } }
  //     if (res.errno === 0) {
  //       that.setData({
  //         historyKeyword: res.data.historyKeywordList,
  //         defaultKeyword: res.data.defaultKeyword,
  //         hotKeyword: res.data.hotKeywordList
  //       });
  //     }
  //   // });
  // },

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
          duration: 1000
        });
        app.globalData.refreshCart = true
        // self.getCartList()
      } else if (res.text == "添加商品超出库存量") {
        wx.showToast({
          // image: '../../images/icon_error.png',
          icon:"none",
          title: '库存不足',
          duration: 1000,
          mask: true
        });
      } else if (res.text == "无法继续添加了") {
        wx.showToast({
          // image: '../../images/icon_error.png',
          icon:"none",
          title: '无法继续添加了',
          duration: 1000,
          mask: true
        });
      }
    });
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

  inputChange: function (e) {
    let char = e.detail.value
    // const reg = /^[A-Za-z]+$/;
    // let isEng = reg.test(char)
    this.setData({
      keyword: e.detail.value
    })
    this.getSearchResult()
    // let searchList = []
    // if (char && this.data.goodsList.length > 0) {
    //   if (isEng) {
    //     // 字母搜索
    //     searchList = this.data.goodsList.filter(function(res) {
    //       // console.info(res)
    //       let zimu = pinyin.pinyin(res.name)
    //       // console.info(zimu)
    //       return zimu.indexOf(char) != -1
    //     })
    //   } else {
    //     searchList = this.data.goodsList.filter(function(res) {
    //       return res.name.indexOf(char) != -1
    //     })
    //   }
    // } else {
    //   searchList = []
    // }
    // this.data.searchList = searchList
    // if (char) {
    //   this.data.searchStatus = true
    // } else {
    //   this.data.searchStatus = false
    // }
    // console.info(searchList)
    // this.setData(this.data)
  },

  getSearchResult: function () {
    let char = this.data.keyword
    const reg = /^[A-Za-z]+$/;
    let isEng = reg.test(char)
    let searchList = []
    if (char && this.data.goodsList.length > 0) {
      if (isEng) {
        // 字母搜索
        searchList = this.data.goodsList.filter(function (res) {
          // console.info(res)
          let zimu = pinyin.pinyin(res.name)
          // console.info(zimu)
          return zimu.indexOf(char) != -1
        })
      } else {
        searchList = this.data.goodsList.filter(function (res) {
          return res.name.indexOf(char) != -1
        })
      }
    } else {
      searchList = []
    }
    this.data.searchList = searchList
    // if (char) {
    //   this.data.searchStatus = true
    // } else {
    //   this.data.searchStatus = false
    // }
    // console.info(searchList)
    this.setData(this.data)
    this.panic()
  },
  // getHelpKeyword: function () {
  //   let that = this;
  //   // util.request(api.SearchHelper, { keyword: that.data.keyword }).then(function (res) {
  //   var res = { "errno": 0, "errmsg": "", "data": ["520元礼包抢先领"] }
  //     if (res.errno === 0) {
  //       that.setData({
  //         helpKeyword: res.data
  //       });
  //     }
  //   // });
  // },
  inputFocus: function () {
    this.setData({
      searchStatus: true,
      // goodsList: []
    });

    // if (this.data.keyword) {
    //   this.getHelpKeyword();
    // }
  },

  clearHistory: function () {
    this.setData({
      searchkeyword: []
    })

    wx.clearStorage('search')
  },
  // clearHistory: function () {
  //   this.setData({
  //     historyKeyword: []
  //   })

  //   util.request(api.SearchClearHistory, {}, 'POST')
  //     .then(function (res) {
  //       // console.log('清除成功');
  //     });
  // },
  // getGoodsList: function () {
  //   let that = this;
  //   // util.request(api.GoodsList, { keyword: that.data.keyword, page: that.data.page, size: that.data.size, sort: that.data.currentSortType, order: that.data.currentSortOrder, categoryId: that.data.categoryId }).then(function (res) {
  //   var res = { "errno": 0, "errmsg": "", "data": { "count": 5, "totalPages": 1, "pageSize": 10, "currentPage": 1, "data": [{ "id": 1127052, "name": "纯棉水洗色织格夏凉被", "list_pic_url": "http://yanxuan.nosdn.127.net/4f483526cfe3b953f403ae02049df5b9.png", "retail_price": 169 }, { "id": 1027004, "name": "色织六层纱布夏凉被", "list_pic_url": "http://yanxuan.nosdn.127.net/6252f53aaf36c072b6678f3d8c635132.png", "retail_price": 249 }, { "id": 1023012, "name": "色织华夫格夏凉被", "list_pic_url": "http://yanxuan.nosdn.127.net/07376e78bf4fb8a5aa8e6a0b1437c3ad.png", "retail_price": 299 }, { "id": 1023034, "name": "泡泡纱可水洗夏凉被", "list_pic_url": "http://yanxuan.nosdn.127.net/715899c65c023bb4973fb0466a5b79d6.png", "retail_price": 299 }, { "id": 1130049, "name": "柔软凉爽天丝麻蚕丝填充夏凉被", "list_pic_url": "http://yanxuan.nosdn.127.net/d88513f85b3617d734bde93af2c766c9.png", "retail_price": 429 }], "filterCategory": [{ "id": 0, "name": "全部", "checked": true }, { "id": 1005000, "name": "居家", "checked": false }], "goodsList": [{ "id": 1127052, "name": "纯棉水洗色织格夏凉被", "list_pic_url": "http://yanxuan.nosdn.127.net/4f483526cfe3b953f403ae02049df5b9.png", "retail_price": 169 }, { "id": 1027004, "name": "色织六层纱布夏凉被", "list_pic_url": "http://yanxuan.nosdn.127.net/6252f53aaf36c072b6678f3d8c635132.png", "retail_price": 249 }, { "id": 1023012, "name": "色织华夫格夏凉被", "list_pic_url": "http://yanxuan.nosdn.127.net/07376e78bf4fb8a5aa8e6a0b1437c3ad.png", "retail_price": 299 }, { "id": 1023034, "name": "泡泡纱可水洗夏凉被", "list_pic_url": "http://yanxuan.nosdn.127.net/715899c65c023bb4973fb0466a5b79d6.png", "retail_price": 299 }, { "id": 1130049, "name": "柔软凉爽天丝麻蚕丝填充夏凉被", "list_pic_url": "http://yanxuan.nosdn.127.net/d88513f85b3617d734bde93af2c766c9.png", "retail_price": 429 }] } }
  //     if (res.errno === 0) {
  //       that.setData({
  //         searchStatus: true,
  //         categoryFilter: false,
  //         goodsList: res.data.data,
  //         filterCategory: res.data.filterCategory,
  //         page: res.data.currentPage,
  //         size: res.data.numsPerPage
  //       });
  //     }

  //     //重新获取关键词
  //     that.getSearchKeyword();
  //   // });
  // },
  getGoodsList: function () {
    var self = this
    server.api(api.goodsList, {}, "post").then(function (res) {
      // console.info(res)
      if (res.length > 0) {
        // self.data.warmText = "没有更多数据了~"
        // res = res.map(function (eData) {
        //   eData.image[0] = eData.image[0] + "?imageView2/0/w/300/h/300"
        //   return eData
        // })
        // for (let i in self.data.allGoodsList) {
        //   if (self.data.allGoodsList[i].id == self.data.id) {
        //     self.data.allGoodsList[i].list = self.data.allGoodsList[i].list.concat(res)
        //     self.data.allGoodsList[i].last_id++

        //     self.data.last_id = self.data.allGoodsList[i].last_id
        //     self.data.goodsList = self.data.allGoodsList[i].list
        //   }
        // }
        self.data.goodsList = res
        self.setData(self.data)
      }
      // self.data.canPullData = true
    })
  },

  panic: function () {
    let self = this
    let current_time = new Date()
    let date = current_time.getFullYear() + '/' + (current_time.getMonth() + 1) + '/' + current_time.getDate() + ' '
    let hms = current_time.getHours() + ':' + current_time.getMinutes() + ':' + current_time.getSeconds()

    let flag = 0,
      havePanic = false
    let waterfallList = self.data.searchList
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
              self.data.searchList = waterfallList
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
              // waterfallList[i].time = h + ':' + m + ':' + s
              waterfallList[i].isPanic = true
              self.data.goodsList = waterfallList
              self.setData(self.data)
              // console.info(self.data.waterfallGoods)
            }
          }, 1000)
        } else {
          flag++
          let num = 0
          for (let i in waterfallList) {
            if (waterfallList[i].panic_buying_id) {
              num++
            }
          }
          if (flag == num && havePanic) {
            setTimeout(() => {
              self.panic()
            }, 1000)
          }
        }
      }
    }
  },

  onKeywordTap: function (event) {
    // this.getSearchResult(event.target.dataset.keyword);
    this.setData({
      keyword: event.currentTarget.dataset.keyword,
      searchStatus: false
    })
    this.getSearchResult()
  },
  // getSearchResult(keyword) {
  //   this.setData({
  //     keyword: keyword,
  //     page: 1,
  //     categoryId: 0,
  //     goodsList: []
  //   });

  //   this.getGoodsList();
  // },
  // openSortFilter: function (event) {
  //   let currentId = event.currentTarget.id;
  //   switch (currentId) {
  //     case 'categoryFilter':
  //       this.setData({
  //         'categoryFilter': !this.data.categoryFilter,
  //         'currentSortOrder': 'asc'
  //       });
  //       break;
  //     case 'priceSort':
  //       let tmpSortOrder = 'asc';
  //       if (this.data.currentSortOrder == 'asc') {
  //         tmpSortOrder = 'desc';
  //       }
  //       this.setData({
  //         'currentSortType': 'price',
  //         'currentSortOrder': tmpSortOrder,
  //         'categoryFilter': false
  //       });

  //       this.getGoodsList();
  //       break;
  //     default:
  //       //综合排序
  //       this.setData({
  //         'currentSortType': 'default',
  //         'currentSortOrder': 'desc',
  //         'categoryFilter': false
  //       });
  //       this.getGoodsList();
  //   }
  // },
  // selectCategory: function (event) {
  //   let currentIndex = event.target.dataset.categoryIndex;
  //   let filterCategory = this.data.filterCategory;
  //   let currentCategory = null;
  //   for (let key in filterCategory) {
  //     if (key == currentIndex) {
  //       filterCategory[key].selected = true;
  //       currentCategory = filterCategory[key];
  //     } else {
  //       filterCategory[key].selected = false;
  //     }
  //   }
  //   this.setData({
  //     'filterCategory': filterCategory,
  //     'categoryFilter': false,
  //     categoryId: currentCategory.id,
  //     page: 1,
  //     goodsList: []
  //   });
  //   this.getGoodsList();
  // },
  onKeywordConfirm(event) {
    // console.info(event)
    // this.getSearchResult(event.detail.value);
    this.setData({
      searchStatus: false,
      // goodsList: []
    });

    let searchkeyword = wx.getStorageSync('search')
    // console.info(searchkeyword)
    if (!searchkeyword) {
      searchkeyword = []
    }
    // console.info(this.data.keyword)
    if (this.data.keyword) {
      searchkeyword.push(this.data.keyword)
      this.setData({
        searchkeyword: searchkeyword
      })
      wx.setStorageSync('search', searchkeyword)
    }
  }
})