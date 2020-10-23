// pages/my/afterSale/saleDesc.js
const server = require('../../../utils/server.js')
const api = require('../../../config/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsStatus: '', // 仅退款需要 未收到货/已收到货
    refundReason: '', // 退款/退货退款原因 选择器中选择出来的
    exchange: '七天无理由换货', // 换货原因 仅换货需要 退款原因 和 换货原因 选其一
    address: {}, // 仅换货需要 

    // 三种售后选择器选择器
    // 退款
    goodsStatusList: ['已收到货', '未收到货'], // 根据选择决定 norGoodsList/haveGoodsList
    // norGoodsList: ['不喜欢/不想要', '空包裹', '未按约定时间发货', '快递/物流一直未送到', '快递/物流无跟踪记录'],
    // haveGoodsList: ['退运费', '商品成分描述不符', '生产日期/保质期与商品描述不符', '图片/产地/批号/规格等描述不符', '质量问题'],
    norGoodsList: ['商品破损/质量问题', '发错货', '多拍错拍', '其他'],
    haveGoodsList: ['商品破损/质量问题', '发错货', '多拍错拍', '其他'],
    // 退货退款
    sendBackList: ['退运费', '大小/尺寸与商品描述不符', '颜色/图案/款式与商品描述不符', '材质面料与商品描述不符'],

    // 仅退款 ： 根据收货与否选择原因
    // 退货退款 ： 根据带参id=1
    refundReasonList: [], // 包括 退款 和 退货退款 norGoodsList/haveGoodsList/sendBackList
    // 换货
    exchangeList: ['七天无理由换货'],

    winHeight: 0,
    saleType: null, //0退款，1退货退款，2换货

    orderDetail: '',
    total_goods_price: '',
    total_price: '',

    goodsNumber: 1, //欲退货数量 不得超过购买总数
    refund: '', // 退款金额 换货没有

    // 图片
    imgList: [], // 展示的图片
    uploadList: [], // 上传的图片

    description: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    // 获取屏幕尺寸，通过内容min-height，使提交在屏幕底部
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        self.setData({
          winHeight: calc - 106,
        });
      }
    });
    const orderDetail = app.globalData.orderDetail
    this.setData({
      orderDetail: orderDetail
    })
    this.data.orderDetail.single_price = Number(this.data.orderDetail.single_price).toFixed(2)
    this.data.orderDetail.postage = Number(this.data.orderDetail.postage).toFixed(2)
    // this.data.orderDetail.create_time = util.formatTime(new Date(this.data.orderDetail.create_time))
    this.data.total_goods_price = Number((orderDetail.single_price * orderDetail.number)).toFixed(2)
    // this.data.total_price = (Number(orderDetail.single_price * orderDetail.number) + Number(orderDetail.postage)).toFixed(2)
    this.data.total_price = orderDetail.discount_price_total ? orderDetail.discount_price_total : (Number(orderDetail.single_price * orderDetail.number)).toFixed(2)
    this.setData(this.data)
    // console.info(this.data.orderDetail)

    if (options.id) {
      self.setData({
        saleType: Number(options.id)
      })
      // 退货退款
      if (options.id == 1) {
        self.setData({
          refundReasonList: self.data.sendBackList
        })
      }
      // 换货地址 原订单地址
      // if (options.id == 2) {
      //   this.data.address.address_text = this.data.orderDetail.address_text
      //   this.data.address.receiver = this.data.orderDetail.receiver
      //   this.data.address.tel = this.data.orderDetail.tel
      //   this.setData(this.data)
      // }
    }

    this.getRefund()
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
            key: 'afterSale_' + self.getPicKey(i, res.tempFilePaths[i].substring(res.tempFilePaths[i].lastIndexOf("."))),
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

  // 补充说明
  getDescription: function(e) {
    this.setData({
      description: e.detail.value
    })
  },


  sumbit: function() {
    const saleType = this.data.saleType //0退款，1退货退款，2换货
    if (saleType == 0) {
      if (this.data.goodsStatus.length <= 0) { //货物状态
        wx.showToast({
          title: '请选择货物状态',
          icon: 'none'
        })
        return false
      }
    }
    if (saleType == 0 || saleType == 1) { // 退款/退货退款原因 选择器中选择出来的
      if (this.data.refundReason.length <= 0) {
        wx.showToast({
          title: '请选择退款原因',
          icon: 'none'
        })
        return false
      }
    }
    this.uploadImg()
  },

  uploadImg: function() {
    var self = this
    var img = this.data.imgList.map(function(res) {
      for (let i in self.data.uploadList) {
        if (self.data.uploadList[i].key == res.key) {
          res.uploadToken = self.data.uploadList[i].uploadToken
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
      })
      for (var k in self.data.imgList) {
        server.qiniuUpload(self.data.imgList[k]).then(function(res) {
          count++
          if (count == self.data.imgList.length) {
            wx.showToast({
              title: '图片上传成功',
            })
            self.addAfterSale()
          }
        })
      }
    } else {
      self.addAfterSale()
    }
  },

  addAfterSale: function() {
    var self = this
    var imgNameList = []
    if (this.data.imgList.length > 0) {
      imgNameList = this.data.imgList.map(function(res) {
        return res.key
      })
    }
    var text = encodeURIComponent(self.data.description.replace(/%/g, '%25'))
    // var goodsStatus = ''
    var reason = ''
    var address = []
    var refund = ''
    // if (this.data.saleType == 0) {
    //   goodsStatus = this.data.goodsStatus
    // }
    if (this.data.saleType == 0 || this.data.saleType == 1) {
      reason = this.data.refundReason
      refund = this.data.refund
    } else {
      reason = this.data.exchange
    }
    if (this.data.saleType == 2) {
      address[0] = this.data.address
    }
    if (this.data.saleType == 3) {

    }
    // console.info(text)
    // console.info(this.data.goodsStatus)
    // console.info(this.data.refundReason)
    // console.info(imgNameList)
    // console.info(self.data.address)
    // console.info('到此为止了')
    // console.info(this.data.goodsNumber)
    // 到此为止了
    // return
    server.api(api.addAfterSale, {
      saleType: this.data.saleType,
      img_name_list: imgNameList, // 可以为空
      description: text, // 可以为空
      order_id: self.data.orderDetail.id,
      // goodsState: goodsStatus, //可以为空
      reason: reason,
      number: this.data.goodsNumber,
      refund: refund, // 可以为空
      address: address
    }, "post").then(function(res) {
      if (res.text == "申请售后成功") {
        wx.showToast({
          title: '申请售后成功',
        })
        app.globalData.refreshAfterSale = true
        setTimeout(() => {
          wx.navigateBack({
            delta: 3
          })
        }, 1000)
      }
    })
  },

  goodsStatus(e) {
    const norGoodsList = this.data.norGoodsList
    const haveGoodsList = this.data.haveGoodsList
    this.setData({
      goodsStatus: this.data.goodsStatusList[e.detail.value],
      refundReason: '',
      refundReasonList: (e.detail.value == 0 ? haveGoodsList : norGoodsList) // 未收货的退款原因norGoodsList，已收货的退款原因haveGoodsList
    })
  },

  refundReason(e) {
    this.setData({
      refundReason: this.data.refundReasonList[e.detail.value],
    })
  },

  cutNumber() {
    let number = (this.data.goodsNumber - 1 > 1) ? this.data.goodsNumber - 1 : 1;
    this.setData({
      goodsNumber: number
    });
    this.getRefund()
  },
  addNumber() {
    let number = (this.data.goodsNumber + 1 <= this.data.orderDetail.number ? this.data.goodsNumber + 1 : this.data.goodsNumber);
    this.setData({
      goodsNumber: number
    });
    this.getRefund()
  },

  // 根据goodsNumber计算退款金额
  getRefund() {
    var refund = ''
    if (this.data.goodsNumber < this.data.orderDetail.number) {
      refund = Number(this.data.goodsNumber * this.data.orderDetail.single_price).toFixed(2)
    } else {
      // refund = Number(Number(this.data.goodsNumber * this.data.orderDetail.single_price) + Number(this.data.orderDetail.postage)).toFixed(2)
      // refund = Number(Number(this.data.goodsNumber * this.data.orderDetail.single_price)).toFixed(2)
      if (this.data.orderDetail.discount_price_total){
        refund = this.data.orderDetail.discount_price_total
      }else{
        refund = Number(Number(this.data.goodsNumber * this.data.orderDetail.single_price)).toFixed(2)
      }
      
    }
    this.setData({
      refund: refund
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
    this.getAddress()
  },
  toChooseAddress() {
    wx.navigateTo({
      url: '../address?selectAddress=true',
    })
  },
  getAddress() {
    if (app.globalData.selectAddress) {
      const selectAddress = app.globalData.selectAddress
      this.data.address.address_text = selectAddress.provinceName + selectAddress.cityName + selectAddress.countyName + selectAddress.detailInfo
      this.data.address.receiver = selectAddress.userName
      this.data.address.tel = selectAddress.telNumber
      this.setData(this.data)
      app.globalData.selectAddress = null
    } else {
      this.data.address.address_text = this.data.orderDetail.address_text
      this.data.address.receiver = this.data.orderDetail.receiver
      this.data.address.tel = this.data.orderDetail.tel
    }
    this.setData(this.data)
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