const api = require('../config/api.js')
var QQMapWX = require('../sdk/qqmap-wx-jssdk.js');

function qqMap() {

}

qqMap.Init = function() {
  if (!qqMap.qqmapsdk) {
    qqMap.qqmapsdk = new QQMapWX({
      key: api.qqMapSubkey
    });
  }
  return qqMap.qqmapsdk
}

module.exports = qqMap

// 骑行路线
// qqmapsdk.direction({
//   mode: "driving",
//   from: {
//     latitude: self.data.mylatitude,
//     longitude: self.data.mylongitude
//   },
//   to: {
//     latitude: self.data.latitude,
//     longitude: self.data.longitude
//   },
//   success: function(res) {
//     var ret = res;
//     var coors = ret.result.routes[0].polyline,
//       pl = [];
//     //坐标解压（返回的点串坐标，通过前向差分进行压缩）
//     var kr = 1000000;
//     for (var i = 2; i < coors.length; i++) {
//       coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
//     }
//     //将解压后的坐标放入点串数组pl中
//     for (var i = 0; i < coors.length; i += 2) {
//       pl.push({
//         latitude: coors[i],
//         longitude: coors[i + 1]
//       })
//     }
//     console.log(pl)
//     //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
//     self.setData({
//       // latitude: pl[0].latitude,
//       // longitude: pl[0].longitude,
//       polyline: [{
//         points: pl,
//         color: '#FF0000DD',
//         width: 4
//       }]
//     })
//   }
// })