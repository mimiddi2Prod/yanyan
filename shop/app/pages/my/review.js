// pages/my/review.js
const server = require('../../utils/server.js')
const api = require('../../config/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面跳转带过来的数据
    orderId: '',
    item_id: '',
    goodsImg: '',
    param_id_1: '',
    param_id_2: '',
    param_1: '',
    param_2: '',
    name: '',
    // 页面填写的数据
    imgList: [], // 展示的图片
    review: '', // 评论

    uploadList: [], // 上传的图片

    orderDetail:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.data.orderId = options.orderId
    // this.data.item_id = options.item_id
    // this.data.goodsImg = options.image
    // this.data.param_id_1 = options.param_id_1
    // this.data.param_id_2 = options.param_id_2
    // this.data.name = options.name
    // this.data.param_1 = options.param_1
    // this.data.param_2 = options.param_2
    // this.setData(this.data)

    const orderDetail = app.globalData.orderDetail
    // console.info(orderDetail)
    this.setData({
      orderDetail: orderDetail
    })
    
  },

  chooseImg() {
    var self = this
    if (this.data.imgList.length >= 9) {
      wx.showToast({
        title: '图片最多上传9张',
      })
      return
    }
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = []
        for (let i in res.tempFilePaths) {
          tempFilePaths.push({
            tempFilePath: res.tempFilePaths[i],
            key: 'review_' + self.getPicKey(i, res.tempFilePaths[i].substring(res.tempFilePaths[i].lastIndexOf("."))),
            uploadToken: ''
          })
        }
        self.setData({
          imgList: self.data.imgList.concat(tempFilePaths)
        })
        // 最多选择9张图片
        if (self.data.imgList.length > 9) {
          self.data.imgList.splice(9, self.data.imgList.length)
          self.setData(self.data)
        }
        // 获取七牛云图片上传token
        for (var j = 0; j < tempFilePaths.length; j++) {
          server.api(api.getUploadToken, {
            key: tempFilePaths[j].key,
            tempFilePath: tempFilePaths[j].tempFilePath
          }, "post").then(function(res) {
            self.data.uploadList.push(res)
            self.setData(self.data)
          })
        }
      },
    })
  },

  getPicKey: function(index, type) {
    var currentTime = new Date()
    var year = currentTime.getFullYear() + '_',
      month = currentTime.getMonth() + 1 + '_',
      day = currentTime.getDate() + '_',
      hours = currentTime.getHours() + '_',
      minutes = currentTime.getMinutes() + '_',
      seconds = currentTime.getSeconds() + '_'
    return year + month + day + hours + minutes + seconds + index + type
  },

  delImg(e) {
    var self = this
    wx.showModal({
      title: '删除',
      content: '是否删除当前选择的图片',
      success: function(res) {
        // console.info(res)
        if (res.confirm) {
          self.data.imgList.splice(e.target.dataset.index, 1)
          self.setData(self.data)
        }
      }
    })
  },

  input: function(e) {
    this.setData({
      review: e.detail.value
    })
  },

  submit: function() {
    wx.showLoading({
      title: '',
      mask: true
    })
    if (this.data.review.length <= 0) {
      wx.showToast({
        title: '没有填写信息',
        icon: 'none'
      })
      return false
    }
    this.uploadImg()
  },

  uploadImg: function() {
    var self = this
    var img = this.data.imgList.map(function(res) {
      // console.info(res)
      for (let i in self.data.uploadList) {
        if (self.data.uploadList[i].key == res.key) {
          // res.name = res.tag + res.key
          res.uploadToken = self.data.uploadList[i].uploadToken
          // console.info(res.name)
        }
      }
      return res
    })
    this.setData({
      imgList: img
    })
    if (self.data.imgList.length > 0) {
      var count = 0
      wx.showLoading({
        title: '图片上传中...',
        mask: true
      })
      for (var k in self.data.imgList) {
        server.qiniuUpload(self.data.imgList[k]).then(function(res) {
          count++
          if (count == self.data.imgList.length) {
            wx.showToast({
              title: '图片上传成功',
              mask: true
            })
            self.addReview()
          }
        })
      }
    } else {
      self.addReview()
    }
  },

  addReview: function() {
    wx.showLoading({
      title: '',
      mask: true
    })
    var self = this
    var imgNameList = []
    if (this.data.imgList.length > 0) {
      imgNameList = this.data.imgList.map(function(res) {
        return res.key
      })
    }
    var text = encodeURIComponent(self.data.review.replace(/%/g, '%25'))
    server.api(api.addReview, {
      img_name_list: imgNameList,
      text: text,
      user_id: app.globalData.user_id,
      trade_id: self.data.orderDetail.tradeId
      // param_id_1: self.data.param_id_1,
      // param_id_2: self.data.param_id_2,
      // param_1: self.data.param_1,
      // param_2: self.data.param_2,
      // item_id: self.data.item_id,
      // order_id: self.data.orderId
    }, "post").then(function(res) {
      if (res.text == "评论成功") {
        wx.showToast({
          title: '反馈成功',
          mask: true
        })
        app.globalData.refreshOrder = true
        setTimeout(() => {
          wx.navigateBack({})
        }, 1000)
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