// pages/my/address.js
const server = require('../../utils/server.js')
const api = require('../../config/api.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // region: '',
    addressList: [],
    editAddress: {
      // cityName: "",
      // countyName: "",
      detailInfo: "",
      nationalCode: "",
      postalCode: "",
      // provinceName: "",
      telNumber: "",
      userName: "",
      adres: '',
      adreslat: '',
      adreslng: ''
    },
    editID: -1, //-1:新建地址 0~n:编辑地址的序号

    // region: [],

    toAuthGetAddress: false,
    toSelectAddress: false,
    // 模态框
    showModal: false,

    // adres: '',
    detailInfo: '',
    tel: '',
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this
    if (options.selectAddress) {
      this.setData({
        toSelectAddress: true
      })
    }


    this.getAddress()
  },

  getAddress: function() {
    var self = this
    server.api(api.getAddress, {
      user_id: app.globalData.user_id
    }, "post").then(function(res) {
      // console.info(res)
      if (res.length > 0) {
        var addressList = []
        for (var i in res) {
          addressList[i] = {
            id: res[i].id,
            // cityName: res[i].city,
            // countyName: res[i].area,
            adres: res[i].adres,
            adreslat: res[i].adreslat,
            adreslng: res[i].adreslng,
            detailInfo: res[i].road,
            // provinceName: res[i].province,
            telNumber: res[i].tel,
            userName: res[i].receiver,
            isDefault: false
          }
          if (app.globalData.default_address) {
            if (addressList[i].id == app.globalData.default_address.id && app.globalData.default_address.isDefault) {
              addressList[i].isDefault = true
            }
          } else {
            app.globalData.default_address = addressList[0]
          }
        }
        self.setData({
          addressList: addressList
        })

        if (!app.globalData.default_address.isDefault) {
          app.globalData.default_address = {}
          // app.globalData.default_address.province = self.data.addressList[0].provinceName
          // app.globalData.default_address.city = self.data.addressList[0].cityName
          // app.globalData.default_address.area = self.data.addressList[0].countyName
          app.globalData.default_address.adres = self.data.addressList[0].adres
          app.globalData.default_address.adreslat = self.data.addressList[0].adreslat
          app.globalData.default_address.adreslng = self.data.addressList[0].adreslng
          app.globalData.default_address.road = self.data.addressList[0].detailInfo
          app.globalData.default_address.tel = self.data.addressList[0].telNumber
          app.globalData.default_address.receiver = self.data.addressList[0].userName
          app.globalData.default_address.id = self.data.addressList[0].id
          app.globalData.default_address.isDefault = false
        }
      } else {
        app.globalData.default_address = null
        self.setData({
          addressList: []
        })
      }

      wx.hideLoading()
    })
  },

  // bindRegionChange(e) {
  //   this.setData({
  //     region: e.detail.value
  //   })
  // },

  // getWxAddress() {
  //   var self = this
  //   wx.chooseAddress({
  //     success: function(res) {
  //       if (res.errMsg === "chooseAddress:ok") {
  //         wx.showLoading({
  //           title: '',
  //         })
  //         server.api(api.addAddress, {
  //           city: res.cityName,
  //           area: res.countyName,
  //           road: res.detailInfo,
  //           province: res.provinceName,
  //           tel: res.telNumber,
  //           receiver: res.userName,
  //           user_id: app.globalData.user_id
  //         }, "post").then(function(res) {
  //           if (res.text == "添加地址成功") {
  //             self.getAddress()
  //           }
  //         })
  //       }
  //     },
  //     fail: function(res) {
  //       if (res.errMsg === "chooseAddress:fail auth deny") {
  //         self.setData({
  //           toAuthGetAddress: true
  //         })
  //       }
  //     }
  //   })
  // },

  showModal: function(e) {
    this.setData({
      showModal: !this.data.showModal
    })
    if (this.data.showModal) {
      if (e.target.dataset.index == -1) {
        this.data.name = ''
        this.data.tel = ''
        this.data.detailInfo = ''
        this.data.editAddress = {
          // cityName: "",
          // countyName: "",
          detailInfo: "",
          nationalCode: "",
          postalCode: "",
          // provinceName: "",
          adres: app.globalData.adres,
          adreslat: app.globalData.adreslat,
          adreslng: app.globalData.adreslng,
          telNumber: "",
          userName: "",
        }
        // this.data.region = []
        this.data.editID = -1
      } else {
        this.data.editAddress = this.data.addressList[e.target.dataset.index]
        // this.data.region[0] = this.data.addressList[e.target.dataset.index].provinceName
        // this.data.region[1] = this.data.addressList[e.target.dataset.index].cityName
        // this.data.region[2] = this.data.addressList[e.target.dataset.index].countyName
        this.data.name = this.data.editAddress.userName
        this.data.tel = this.data.editAddress.telNumber
        this.data.detailInfo = this.data.editAddress.detailInfo

        this.data.editID = e.target.dataset.index
      }
      this.setData(this.data)
    }

  },

  delAddress: function(e) {
    var self = this
    wx.showModal({
      title: '删除',
      content: '是否删除此收货地址？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除地址...',
          })
          server.api(api.delAddress, {
            address_id: self.data.addressList[e.target.dataset.index].id,
            user_id: app.globalData.user_id
          }, "post").then(function(res) {
            if (res.text == "删除成功") {
              // 如果选中的是默认地址 那么把user表address_id设置为NULL
              if (app.globalData.default_address) {
                if (self.data.addressList[e.target.dataset.index].id == app.globalData.default_address.id && app.globalData.default_address.isDefault) {
                  server.api(api.updateDefaultAddress, {
                    user_id: app.globalData.user_id,
                    address_id: 0
                  }, "post").then(function(res) {
                    if (res.text == "默认地址置空") {
                      app.globalData.default_address = null
                      self.getAddress()
                    }
                  })
                } else {
                  if (self.data.addressList[e.target.dataset.index].id == app.globalData.default_address.id) {
                    app.globalData.default_address = null
                  }
                  self.getAddress()
                }
              } else {
                self.getAddress()
              }

            }
          })
        }
      }
    })
  },

  getName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  gettel: function(e) {
    // console.info(e.detail)
    this.setData({
      tel: e.detail.value
    })
  },

  getDetailInfo: function(e) {
    this.setData({
      detailInfo: e.detail.value
    })
  },

  saveAddress: function(e) {
    // console.info(this.data.editID)
    // console.info(this.data.name)
    // console.info(this.data.addressList[this.data.editID])
    var self = this
    let editAddress = {}
    if (this.data.editID == -1) {
      // 新建
      editAddress = {
        road: this.data.detailInfo,
        adres: app.globalData.adres,
        adreslat: app.globalData.adreslat,
        adreslng: app.globalData.adreslng,
        tel: this.data.tel,
        receiver: this.data.name,
        user_id: app.globalData.user_id
      }

    } else {
      // 编辑
      let temp = this.data.addressList[this.data.editID]
      editAddress = {
        road: temp.detailInfo,
        adres: temp.adres,
        adreslat: temp.adreslat,
        adreslng: temp.adreslng,
        tel: temp.telNumber,
        receiver: temp.userName,
        user_id: app.globalData.user_id,
        address_id: temp.id
      }
      if (app.globalData.adres) {
        editAddress.adres = app.globalData.adres
        editAddress.adreslat = app.globalData.adreslat
        editAddress.adreslng = app.globalData.adreslng
      }
      if (this.data.name) {
        editAddress.receiver = this.data.name
      }
      if (this.data.tel) {
        editAddress.tel = this.data.tel
      }
      if (this.data.detailInfo) {
        editAddress.road = this.data.detailInfo
      }
    }

    if (!editAddress.receiver) {
      wx.showToast({
        title: '请填写收货人姓名',
        icon: 'none'
      })
      return
    }
    if (!editAddress.tel) {
      wx.showToast({
        title: '请填写收货人号码',
        icon: 'none'
      })
      return
    }
    if (!editAddress.adres) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    if (!editAddress.road) {
      wx.showToast({
        title: '请补充楼号等详细信息',
        icon: 'none'
      })
      return
    }
    // console.info(editAddress)
    if (this.data.editID == -1) {
      server.api(api.addAddress, editAddress, "post").then(function(res) {
        if (res.text == "添加地址成功") {
          self.data.showModal = false
          self.setData(self.data)
          self.getAddress()
        }
      })
    } else {
      server.api(api.updateAddress, editAddress, "post").then(function(res) {
        if (res.text == "更新地址成功") {
          self.data.showModal = false
          self.setData(self.data)
          self.getAddress()
        }
      })
    }
    // return

    // let editAddress = {
    //   // city: "",
    //   // area: "",
    //   road: "",
    //   // province: "",
    //   adres: app.globalData.adres,
    //   adreslat: app.globalData.adreslat,
    //   adreslng: app.globalData.adreslng,
    //   tel: "",
    //   receiver: "",
    //   user_id: app.globalData.user_id
    // }
    // // editAddress.road = e.detail.value.detailInfo
    // // editAddress.tel = e.detail.value.telNumber
    // // editAddress.receiver = e.detail.value.userName

    // editAddress.road = this.data.detailInfo
    // editAddress.tel = this.data.tel
    // editAddress.name = this.data.name

    // if (this.data.editID == -1) {
    //   server.api(api.addAddress, editAddress, "post").then(function(res) {
    //     if (res.text == "添加地址成功") {
    //       self.data.showModal = false
    //       self.setData(self.data)
    //       self.getAddress()
    //     }
    //   })
    // } else {
    //   // 编辑地址
    //   editAddress.address_id = this.data.addressList[this.data.editID].id
    //   if (!editAddress.adres) {
    //     editAddress.adres = this.data.addressList[this.data.editID].adres
    //     editAddress.adreslat = this.data.addressList[this.data.editID].adreslat
    //     editAddress.adreslng = this.data.addressList[this.data.editID].adreslng
    //   }
    //   server.api(api.updateAddress, editAddress, "post").then(function(res) {
    //     if (res.text == "更新地址成功") {
    //       self.data.showModal = false
    //       self.setData(self.data)
    //       self.getAddress()
    //     }
    //   })
    // }

  },

  setDefault: function(e) {
    var self = this
    wx.showLoading({
      title: '',
    })
    server.api(api.updateDefaultAddress, {
      user_id: app.globalData.user_id,
      address_id: this.data.addressList[e.target.dataset.index].id
    }, "post").then(function(res) {
      if (res.text == "更改默认地址成功") {
        app.globalData.default_address = res.default_address
        self.getAddress()
      }
    })
  },

  selectAddress: function(e) {
    if (this.data.toSelectAddress) {
      app.globalData.selectAddress = this.data.addressList[e.currentTarget.dataset.index]
      wx.navigateBack({
        delta: 1
      })
    }
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
    if (app.globalData.adres) {
      // this.setData({
      //   adres: app.globalData.adres
      // })
      this.data.editAddress.adres = app.globalData.adres
      this.data.editAddress.adreslat = app.globalData.adreslat
      this.data.editAddress.adreslng = app.globalData.adreslng
      this.setData(this.data)
    }
    // if (this.data.name) {
    this.data.editAddress.userName = this.data.name
    // }
    // if (this.data.tel) {
    this.data.editAddress.telNumber = this.data.tel
    // }
    // if (this.data.detailInfo) {
    this.data.editAddress.detailInfo = this.data.detailInfo
    // }
    this.setData(this.data)
    var self = this
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.address'] == false) {
          // console.info("用户拒绝过授权")
          self.data.toAuthGetAddress = true
        } else {
          self.data.toAuthGetAddress = false
        }
        self.setData(self.data)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})