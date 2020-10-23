const app = getApp();

function pay(url, money, order, method = 'get') {
  // console.info(app.globalData.openid)
  // console.info(money)
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: {
        openid: app.globalData.openid,
        money: money,
        order: order
      },
      method: method,
      success: function(res) {
        // console.info(res)
        var tradeId = res.data.data.tradeId
        // return
        // 调起支付
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': 'MD5',
          'paySign': res.data.data.paySign,
          'success': function(res) {
            // console.info(res.errMsg)
            resolve(tradeId)
          },
          'fail': function(res) {
            // console.info(res)
            reject(tradeId)
          }
        });
      },
      fail: function(res) {
        wx.showModal({
          content: '请求错误',
        })
        reject(res.data)
      }
    });
  })
};

module.exports = {
  pay: pay,
};