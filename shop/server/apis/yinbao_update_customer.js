var yinbaoAppId = require('./../config/yinbaoConfig').appId
var request = require('../utils/yinbaoRequest')
var fm = require('./../utils/formatTime')
var jsonBigInt = require('json-bigint')({"storeAsString": true})

async function YinbaoUpdateCustomer(data) {
    data.balanceIncrement = 0 - Number(data.balanceIncrement)
    data.pointIncrement = data.pointIncrement >> 0
    let callData = {}
    // 1.更新会员信息
    let dataChangeTime = fm(new Date())
    let postData = {
        "appId": yinbaoAppId,
        "customerUid": data.customerUid,
        "balanceIncrement": data.balanceIncrement,
        "pointIncrement": data.pointIncrement,
        "dataChangeTime": dataChangeTime,
    }
    let postDataJson = JSON.stringify(postData)
    let router = "updateBalancePointByIncrement"
    let e = await request(router, postDataJson)

    e = jsonBigInt.parse(e)
    if (e.data) {
        if ((e.data.balanceIncrement == data.balanceIncrement) && (e.data.pointIncrement == Number(data.pointIncrement))) {
            callData.code = 0
            callData.text = "success"
            callData.data = {}
            callData.data.balanceAfterUpdate = e.data.balanceAfterUpdate
            callData.data.pointAfterUpdate = e.data.pointAfterUpdate
        }
    }
    return callData

}

module.exports = YinbaoUpdateCustomer;
