// pages/location/location.js
const server = require('../../utils/server.js')
const api = require('../../config/api.js');

var qqmapsdk = require('./../../utils/qqMap.js').qqmapsdk

//获取应用实例
const app = getApp()
// console.info(app.globalData.shopLocation)
var shopLocation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '',

    opCity: ['三明市'],
    slcCity: '三明市',
    keyword: '',
    keywordList: [],

    modal: false,
    foldImg: '/images/fold.png',

    streetList: [],
  },

  getCity: function(e) {
    this.setData({
      slcCity: e.currentTarget.dataset.city,
      modal: false
    })
    this.useKeyWordSearch()
  },

  Input: function(e) {
    this.setData({
      keyword: e.detail.value
    })
    this.useKeyWordSearch()
  },



  modal: function() {
    this.setData({
      modal: !this.data.modal,
      foldImg: this.data.foldImg == '/images/fold.png' ? '/images/unfold.png' : '/images/fold.png'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    shopLocation = {
      latitude: app.globalData.shopLocation.split(",")[0],
      longitude: app.globalData.shopLocation.split(",")[1]
    }
    this.location()

    // wx.getLocation({
    //   type: 'gcj02',
    //   isHighAccuracy: true,
    //   success: function (res) {

    //   },
    //   fail: function (res) {

    //   }
    // })
  },

  location: function() {
    let self = this
    wx.getSetting({
      success: function(res) {
        // console.info(res)
        // 有定位权限
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            type: 'gcj02',
            isHighAccuracy: true,
            success: function(res) {
              // console.info(res)
              // 根据坐标获取地点名
              qqmapsdk.reverseGeocoder({
                location: {
                  latitude: res.latitude,
                  longitude: res.longitude
                },
                get_poi: 1,
                poi_options: 'policy=2;radius=3000;page_size=20;page_index=1',
                success: function(res) {
                  if (res.message == "query ok") {
                    let pois = res.result.pois
                    // console.info(pois)
                    // console.info(shopLocation)
                    let to = []
                    pois.unshift({
                      // title: res.result.formatted_addresses.recommend,
                      title: res.result.address_reference.landmark_l2.title,
                      address: res.result.address,
                      location: res.result.location,
                    })
                    for (let i in pois) {
                      to.push({
                        latitude: pois[i].location.lat,
                        longitude: pois[i].location.lng
                      })
                    }
                    qqmapsdk.calculateDistance({
                      mode: 'driving',
                      from: {
                        latitude: shopLocation.latitude,
                        longitude: shopLocation.longitude
                      },
                      to: to,
                      // to: [{
                      //   latitude: pois[i].location.lat,
                      //   longitude: pois[i].location.lng
                      // }],
                      success: function(res) {
                        if (res.message == "query ok") {
                          pois = pois.map(function(item, index) {
                            item.distance = res.result.elements[index].distance
                            item.duration = res.result.elements[index].duration
                            // 是否在配送范围内
                            if (item.distance < app.globalData.shopDistance) {
                              item.CanDeliver = true
                            } else {
                              item.CanDeliver = false
                            }
                            return item
                          })
                          self.setData({
                            streetList: pois
                          })
                        }
                      }
                    })
                  }
                }
              })
            },
          })
        } else {
          // 没有定位权限
          self.setData({
            msg: "定位失败"
          })
        }
      }
    })
  },

  getLocation: function(e) {
    let candeliver = e.currentTarget.dataset.candeliver
    if (!candeliver) {
      wx.showToast({
        title: '该地址不在配送范围内',
        icon: 'none'
      })
      return false
    }
    // 获取坐标 返回首页
    // console.info(e)
    let location = e.currentTarget.dataset.location
    let address = e.currentTarget.dataset.adres
    let title = e.currentTarget.dataset.title
    app.globalData.mylatitude = location.lat
    app.globalData.mylongitude = location.lng

    app.globalData.adreslat = location.lat
    app.globalData.adreslng = location.lng
    app.globalData.adres = address + title

    wx.navigateBack({})
  },

  useKeyWordSearch: function() {
    var self = this
    if (!self.data.keyword){
      return false
    }
    qqmapsdk.search({
      keyword: self.data.keyword,
      region: self.data.slcCity,
      success: function(res) {
        // console.info(res)
        if (res.count > 0) {
          let list = res.data
          let to = []
          for (let i in list) {
            to.push({
              latitude: list[i].location.lat,
              longitude: list[i].location.lng
            })
          }

          qqmapsdk.calculateDistance({
            mode: 'driving',
            from: {
              latitude: shopLocation.latitude,
              longitude: shopLocation.longitude
            },
            to: to,
            success: function(res) {
              if (res.message == "query ok") {
                list = list.map(function(item, index) {
                  item.distance = res.result.elements[index].distance
                  item.duration = res.result.elements[index].duration
                  // 是否在配送范围内
                  if (item.distance < app.globalData.shopDistance) {
                    item.CanDeliver = true
                  } else {
                    item.CanDeliver = false
                  }
                  return item
                })
                // console.info(list)
                self.setData({
                  keywordList: list
                })
              }
            }
          })
        }
      },
      fail: function(res) {
        // console.log(res);
      },
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
    if (this.data.msg == '定位失败') {
      this.location()
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})