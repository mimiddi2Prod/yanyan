const app = getApp()

function api(url, data = {}, method = "GET") {
  // console.info(data)
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      success: function(res) {
        // console.info(res)
        if (res.data.res.code == 0) {
          resolve(res.data.data);
        } else {
          // if (res.data.res.text != "找不到该用户") {
            wx.showToast({
              title: res.data.res.text,
              icon: 'none'
            })
          // }
        }
      },
    })
  })
}

function qiniuUpload(data = {}) {
  return new Promise(function(resolve, reject) {
    wx.uploadFile({
      url: 'https://up.qiniup.com/',
      filePath: data.tempFilePath,
      name: 'file',
      formData: {
        'key': data.key,
        'token': data.uploadToken
      },
      success: function(res) {
        // console.info(res)
        if (res.statusCode == 200) {
          resolve(res.statusCode)
        } else {
          wx.showToast({
            title: '图片上传失败',
          })
        }
      },
    })
  })
}



module.exports = {
  api: api,
  qiniuUpload: qiniuUpload
};