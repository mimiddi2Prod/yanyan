var server = require('../../utils/server.js');
var api = require('../../config/api.js');

const app = getApp()
Page({
  data: {
    // text:"这是一个页面"
    navList: [],
    allGoodsList: [],
    goodsList: [],
    id: 0,
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    // scrollHeight: 0,
    // page: 1,
    // size: 10000

    last_id: 0,
    warmText: '',

    canPullData: true,
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    // console.info(app.globalData.subCategory)
    if (options.id) {
      that.setData({
        id: parseInt(options.id)
      });
      this.loadSwitchCate(options.id)
    }
    if (options.parentid) {
      this.getSubCategory(options.parentid)
    } else {
      that.setData({
        navList: app.globalData.subCategory,
      });

      this.data.allGoodsList = app.globalData.subCategory.subCategory
      for (let i in this.data.allGoodsList) {
        this.data.allGoodsList[i].list = []
        this.data.allGoodsList[i].last_id = 0
      }
      this.setData(this.data)

      this.getGoodsList();
    }

    // wx.getSystemInfo({
    //   success: function(res) {
    //     that.setData({
    //       scrollHeight: res.windowHeight
    //     });
    //   }
    // });
    
  },

  loadSwitchCate: function(id) {
    var that = this;
    let clientX = ''
    let sublist = app.globalData.subCategory.subCategory
    for (let i in sublist) {
      if (sublist[i].id == id) {
        clientX = i
      }
    }
    that.setData({
      scrollLeft: clientX * 60
    });
  },

  getGoodsList: function() {
    var self = this
    // console.info(this.data.id)
    server.api(api.goodsList, {
      categoryId: this.data.id,
      last_id: this.data.last_id
    }, "post").then(function(res) {
      // console.info(res)
      if (res.length <= 0) {
        self.data.warmText = "没有更多数据了~"
      } else {
        res = res.map(function(eData){
          eData.image[0] = eData.image[0] + "?imageView2/0/w/300/h/300"
          return eData
        })
        for (let i in self.data.allGoodsList) {
          if (self.data.allGoodsList[i].id == self.data.id) {
            self.data.allGoodsList[i].list = self.data.allGoodsList[i].list.concat(res)
            self.data.allGoodsList[i].last_id++

              self.data.last_id = self.data.allGoodsList[i].last_id
            self.data.goodsList = self.data.allGoodsList[i].list
          }
        }
        // self.data.last_id++
        //   self.data.goodsList = self.data.goodsList.concat(res)
      }
      self.data.canPullData = true
      self.setData(self.data)

      // self.setData({
      //   goodsList: res
      // })
    })
  },

  getSubCategory: function(parentid) {
    var self = this
    server.api(api.category, {}, "post").then(function(res) {
      console.info(res)
      for (var i in res) {
        if (res[i].id == parentid) {
          self.setData({
            navList: res[i]
          })
          app.globalData.subCategory = res[i]

          self.data.allGoodsList = app.globalData.subCategory.subCategory
          for (let j in self.data.allGoodsList) {
            self.data.allGoodsList[j].list = []
            self.data.allGoodsList[j].last_id = 0
          }
          self.setData(self.data)

          self.getGoodsList();
        }
      }


    })
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    // console.log(1);
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.canPullData) {
      this.setData({
        canPullData: false
      })
      this.getGoodsList()
    }
    // this.getGoodsList()
  },


  switchCate: function(event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      id: event.currentTarget.dataset.id
    });

    for (let i in this.data.allGoodsList) {
      if (this.data.allGoodsList[i].id == event.currentTarget.dataset.id) {
        this.data.last_id = this.data.allGoodsList[i].last_id
        this.data.goodsList = this.data.allGoodsList[i].list

        this.data.warmText = ''
        this.setData(this.data)
        if (this.data.allGoodsList[i].list.length <= 0) {
          this.getGoodsList();
        }
      }
    }
    // this.getGoodsList();
  }
})