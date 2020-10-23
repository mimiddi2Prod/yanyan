var yinbaoAppId = require('./../config/yinbaoConfig').appId
var request = require('../utils/yinbaoRequest')
var jsonBigInt = require('json-bigint')({"storeAsString": true});

async function YinbaoGetCustomer(phone) {
    let callData = {}
    // 1.获取会员
    let postData = {
        "appId": yinbaoAppId,
        "customerTel": phone
    }
    let postDataJson = JSON.stringify(postData)
    let router = "queryBytel"
    let e = await request(router, postDataJson)

    e = jsonBigInt.parse(e)
    if (e.data) {
        if (e.data[0].number.length > 0 && e.data[0].phone == phone) {
            callData.code = 0
            callData.text = "success"
            callData.data = {}
            callData.data.point = e.data[0].point
            callData.data.balance = e.data[0].balance
            callData.data.discount = e.data[0].discount
            callData.data.customerUid = e.data[0].customerUid
        }
    }
    return callData

}

module.exports = YinbaoGetCustomer;
