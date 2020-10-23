// pages/group_buy/group_buy.js
var server = require('../../utils/server.js');
var api = require('../../config/api.js');
var util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    waterfallGoods: [],
    integral: 0,
    item_last_id: 0, //瀑布流加载id
    warmText: '',
    test: [{
      "waterfallList": []
    }],
    // test: [{
    //   "waterfallList": [{
    //     "item_id": 22,
    //     "start_time": "2019/06/28 14:57:35",
    //     "end_time": "2019/07/07 17:49:50",
    //     "name": "团购商品1",
    //     "image": ["http://notwastingqiniu.minidope.com/goods_2019_6_22_16_25_29_0.png"],
    //     "url": "../goods/goods",
    //     "qcl": 1,
    //     "price": 0.1,
    //     "describe": "团购测试后i的哈会破坏到手的泼洒建瓯的菩萨觉得怕售价跌破十九点破解撒泼建瓯赔偿金哦啊是从接送安排紧凑扫除迫使",
    //     "id": 0
    //   }, {
    //     "item_id": 22,
    //     "start_time": "2019/06/28 14:57:35",
    //     "end_time": "2019/07/07 17:49:50",
    //     "name": "团购商品1",
    //     "image": ["http://notwastingqiniu.minidope.com/goods_2019_6_22_16_25_29_0.png"],
    //     "url": "../goods/goods",
    //     "qcl": 1,
    //     "price": 0.1,
    //     "describe": "团购测试后",
    //     "id": 1
    //   }, {
    //     "item_id": 22,
    //     "start_time": "2019/06/28 14:57:35",
    //     "end_time": "2019/07/07 17:49:50",
    //     "name": "团购商品1",
    //     "image": ["http://notwastingqiniu.minidope.com/goods_2019_6_22_16_25_29_0.png"],
    //     "url": "../goods/goods",
    //     "qcl": 1,
    //     "price": 0.1,
    //     "describe": "团购测试后那里的看到那世界顶级飞黄金分段菜市场撒吃撒擦三次时间发了机欧派佛怕时间分配静安寺都派佛教案件偶分苏东坡按实际佛帕金斯破发",
    //     "id": 2
    //   }, {
    //     "item_id": 22,
    //     "start_time": "2019/06/28 14:57:35",
    //     "end_time": "2019/07/07 17:49:50",
    //     "name": "团购商品1",
    //     "image": ["http://notwastingqiniu.minidope.com/goods_2019_6_22_16_25_29_0.png"],
    //     "url": "../goods/goods",
    //     "qcl": 1,
    //     "price": 0.1,
    //     "describe": "团购测试后",
    //     "id": 3
    //   }, {
    //     "item_id": 22,
    //     "start_time": "2019/06/28 14:57:35",
    //     "end_time": "2019/07/07 17:49:50",
    //     "name": "团购商品1",
    //     "image": ["http://notwastingqiniu.minidope.com/goods_2019_6_22_16_25_29_0.png"],
    //     "url": "../goods/goods",
    //     "qcl": 1,
    //     "price": 0.1,
    //     "describe": "团购测试后",
    //     "id": 4
    //   }, {
    //     "item_id": 22,
    //     "start_time": "2019/06/28 14:57:35",
    //     "end_time": "2019/07/07 17:49:50",
    //     "name": "团购商品1",
    //     "image": ["http://notwastingqiniu.minidope.com/goods_2019_6_22_16_25_29_0.png"],
    //     "url": "../goods/goods",
    //     "qcl": 1,
    //     "price": 0.1,
    //     "describe": "团购测试后",
    //     "id": 5
    //   }]
    // }],
    colHeightArry: [0, 0], //瀑布流列数
    position: 'relative',
    screenHeight: 0,
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      integral: app.globalData.integral
    });
    this.waterfall()

    // 瀑布流排版
    // if (this.data.test[0].waterfallList.length > 0) {
    //   this.setWaterfall(0)
    // }

    // wx.getSystemInfo({
    //   success: function(res) {
    //     console.info(res)
    //     that.setData({
    //       screenHeight: res.screenHeight + 50
    //     })
    //   },
    // })
    // this.data.test[0].waterfallList = this.data.test[0].waterfallList.map(function(res) {
    //   for (let i in this.data.test[0].waterfallList){
    //     var minValue = that.data.colHeightArry[0]
    //     var minIndex = 0
    //     for (let j = 0; j < 2; j++) {
    //       if (that.data.colHeightArry[j] < minValue) {
    //         minValue = that.data.colHeightArry[j]
    //         minIndex = j
    //       }
    //     }
    //     this.data.test[0].waterfallList[i].left = minValue * minIndex
    //     this.data.test[0].waterfallList[i].top = minValue

    //     that.getCreateSelectorQuery(minIndex, this.data.test[0].waterfallList[i].id).then(function (e) {
    //       console.info(e)
    //       that.data.colHeightArry[minIndex] += e.height
    //       that.setData(that.data)
    //     })
    //   }

    //   // return res
    // // })
    // this.setData(this.data)
    // console.info(this.data.test[0].waterfallList)
  },

  setWaterfall: function(index) {
    // for (let i in this.data.test[0].waterfallList) {
    let that = this
    var minValue = that.data.colHeightArry[0]
    var minIndex = 0
    for (let j = 0; j < 2; j++) {
      if (that.data.colHeightArry[j] < minValue) {
        minValue = that.data.colHeightArry[j]
        minIndex = j
        // console.info('130::' + minIndex)
      }
    }
    // console.info(index)
    this.data.test[0].waterfallList[index].left = minIndex * 365
    this.data.test[0].waterfallList[index].top = minValue
    this.data.screenHeight = minValue + 270
    this.setData(this.data)
    // console.info(this.data.test[0].waterfallList)
    that.getCreateSelectorQuery(minIndex, this.data.test[0].waterfallList[index].id).then(function(e) {
      // console.info(e)
      that.data.colHeightArry[minIndex] += e.height + 20
      that.setData(that.data)
      if (index < that.data.test[0].waterfallList.length - 1) {
        that.setWaterfall(index + 1)
      } else {
        that.setData({
          position: 'absolute'
        })
      }
    })
    // }
    // this.setData(this.data)
  },

  getCreateSelectorQuery: function(minIndex, id) {
    return new Promise(function(resolve, reject) {
      let self = this
      let name = '#content' + id
      // console.info(name)
      const query = wx.createSelectorQuery()
      query.select(name).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res) {
        // console.info(res)
        //res[0].top // #the-id节点的上边界坐标
        //res[1].scrollTop // 显示区域的竖直滚动位置
        // return res
        resolve(res[0])
      })
    })
  },

  waterfall: function() {
    var self = this
    server.api(api.waterfall, {
      item_last_id: self.data.item_last_id,
      type: 2,
    }, "post").then(function(res) {
      // console.info(res)
      if (res.waterfallList.length > 0) {
        res.waterfallList = res.waterfallList.map(function(e) {
          e.start_time = util.formatTime(new Date(e.start_time))
          e.end_time = util.formatTime(new Date(e.end_time))
          return e
        })
        // console.info(res.waterfallList)
        // self.data.waterfallGoods.push({})
        // console.info(self.data.test[0].waterfallList)
        self.data.item_last_id++
          self.data.test[0].waterfallList = self.data.test[0].waterfallList.concat(res.waterfallList)
        self.data.colHeightArry = [0, 0]
      } else {
        self.data.warmText = "没有更多数据了~"
      }
      // if (res.waterfallList.length > 0) {
      //   self.data.item_last_id++
      //     self.data.waterfallGoods[self.data.waterfallGoods.length - 1].waterfallList = res.waterfallList
      // }
      self.setData(self.data)
      if (res.waterfallList.length > 0) {
        self.setWaterfall(0)
      }

    })
  },

  checkIntegral: function(e) {
    let integral = e.currentTarget.dataset.integral
    if (integral > this.data.integral) {
      // console.info(this.data.integral)
      wx.showToast({
        title: '购买该商品所需积分不足',
        icon: 'none',
      })
    } else {
      wx.navigateTo({
        url: '../goods/goods?id=' + e.currentTarget.dataset.id,
      })
    }
  },

  onReachBottom: function() {
    // 页面上划加载
    this.waterfall()
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
})