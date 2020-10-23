// pages/map/map.js
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

    latitude: '',
    longitude: '',
    subkey: api.qqMapSubkey,
    // polyline: '',
    markers: [{
      latitude: '',
      longitude: '',
      title: '',
      // iconPath: '../../images/A.png',
    }],
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
  },

  regionchange: function(e) {
    // console.info(e)

    if (e.type == 'end' && e.causedBy == "drag") {
      // app.showLoading('正在搜索');
      this.getLngLat();
    }
  },

  // 获取中间点的经纬度，并mark出来
  getLngLat: function() {
    var self = this;
    self.mapCtx = wx.createMapContext("myMap"); // 如果有初始化mapCtx，这里可以省略
    self.mapCtx.getCenterLocation({
      success: function(res) {
        // console.info(res)
        let curLatitude = res.latitude;
        let curLongitude = res.longitude;
        // 通过获取的经纬度进行请求数据
        // let data = {
        //   'gisX': curLongitude,
        //   'gisY': curLatitude
        // };
        // that.loadData(data);
        // that.setData({
        //   markers: [{
        //     latitude: curLatitude,
        //     longitude: curLongitude,
        //     title: '',
        //     // iconPath: '../../images/A.png',
        //   }],
        // })
        // self.setData({
        //   latitude: curLatitude,
        //   longitude: curLongitude
        // })
        // 根据坐标获取地点名
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: curLatitude,
            longitude: curLongitude
          },
          get_poi: 1,
          poi_options: 'policy=2;radius=3000;page_size=20;page_index=1',
          success: function(res) {
            // console.info(res)
            // console.info(11111111111)
            if (res.message == "query ok") {
              let pois = res.result.pois
              // console.info(pois)
              // console.info(shopLocation)
              let to = []
              pois.unshift({
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
      }
    })
  },

  location: function() {
    let self = this
    // wx.getSetting({
    //   success: function(res) {
    // console.info(res)
    // 有定位权限
    // if (res.authSetting['scope.userLocation']) {
    //   wx.getLocation({
    //     type: 'gcj02',
    //     isHighAccuracy: true,
    //     success: function(res) {
    // console.info(res)
    let latitude = '',
      longitude = ''

    if (app.globalData.adreslat && app.globalData.adreslng) {
      latitude = app.globalData.adreslat
      longitude = app.globalData.adreslng
    } else {
      latitude = shopLocation.latitude
      longitude = shopLocation.longitude
    }

    this.data.longitude = longitude
    this.data.latitude = latitude
    this.data.markers[0].longitude = longitude
    this.data.markers[0].latitude = latitude
    this.setData(this.data)

    // 根据坐标获取地点名
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
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
    // },
    //   })
    // } else {
    //   // 没有定位权限
    //   self.setData({
    //     msg: "定位失败"
    //   })
    // }
    //   }
    // })
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
    app.globalData.adres = title
    // app.globalData.adres = address + title

    wx.navigateBack({})
  },

  useKeyWordSearch: function() {
    var self = this
    if (!self.data.keyword) {
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