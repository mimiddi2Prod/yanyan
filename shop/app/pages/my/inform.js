// pages/my/inform.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [{
      avatar: '',
      content: '大撒大撒啊实打实的阿斯顿撒旦',
      userType: 0
    }, {
      avatar: '',
      content: '撒的撒旦撒的的打算',
      userType: 1
    }, {
      avatar: '',
      content: 'dasdsadasdasdsasadsaaaaaaaaaaaaaaaaaa大撒大撒啊实打实的阿斯顿撒旦撒的撒的撒旦撒的的打算dasdsd',
      userType: 0
    }, {
      avatar: '',
      content: 'dasdsadasdasdsasadsaaaaaaaaaaaaaaaaaa大撒大撒啊实打实的阿斯顿撒旦撒的撒的撒旦撒的的打算dasdsd',
      userType: 1
    }, {
      avatar: '',
      content: 'dasdsadasdasdsasadsaaaaaaaaaaaaaaaaaa大撒大撒啊实打实的阿斯顿撒旦撒的撒的撒旦撒的的打算dasdsd',
      userType: 1
    }, {
      avatar: '',
      content: '你好',
      userType: 0
    }, {
      avatar: '',
      content: '我不好',
      userType: 1
    }],
    text: '',

    windowHeight: '',
    scrolltop: '',
    marbBottom: '0',
    // opacity:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          windowHeight: res.windowHeight * 100,
          scrolltop: res.windowHeight * 100
        })
      },
    })
  },

  getIpt: function(e) {
    this.setData({
      text: e.detail.value
    })
  },

  submitIpt: function(e) {
    var self = this
    if (this.data.text == '') {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
      })
      return
    }
    var message = {
      avatar: '',
      userType: 1,
      content: '',
    }
    message.content = this.data.text
    this.data.messageList.push(message)
    this.data.text = ''
    this.data.marbBottom = '10%'
    // this.data.opacity = 0
    // console.info(this.data.scrolltop)

    this.setData(this.data)

    setTimeout(function() {
      self.data.marbBottom = '0'
      // self.data.opacity = 1
      self.setData(self.data)
    }, 10)
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