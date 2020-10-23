var yinbaoAppId = require('./../config/yinbaoConfig').appId
var request = require('../utils/yinbaoRequest')
var fm = require('./../utils/formatTime')


async function YinbaoUpdateCustomer(data) {
    data.balanceIncrement = Number(data.balanceIncrement)
    data.pointIncrement = data.pointIncrement >> 0
    data.pointIncrement = 0 - Number(data.pointIncrement)
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

    e = e.replace(/\"customerUid\":/g, "\"customerUid\":\"")
    e = e.replace(/,\"balanceBeforeUpdate\"/g, "\",\"balanceBeforeUpdate\"")

    console.info("获得分类数据：")
    console.info(e)
    e = JSON.parse(e)
    console.info(e)
    if (e.data) {
        if((e.data.balanceIncrement == data.balanceIncrement) && (e.data.pointIncrement == Number(data.pointIncrement))){
            callData.code = 0
            callData.text = "success"
            callData.data = {}
            callData.data.balanceAfterUpdate = e.data.balanceAfterUpdate
            callData.data.pointAfterUpdate = e.data.pointAfterUpdate
        }
    }
    // else {
    //     // 2.没查询到对应的会员卡 注册
    //     let postData = {
    //         "appId": yinbaoAppId,
    //         "customerInfo":{
    //             "number": phone
    //         }
    //     }
    //     let postDataJson = JSON.stringify(postData)
    //     console.info(postDataJson)
    //     let router = "add"
    //     let e = await request(router, postDataJson)
    //     console.info("获得分类数据：")
    //     console.info(e)
    //     e = JSON.parse(e)
    //     if (e.data) {
    //         if (e.data.number.length > 0 && e.data.number == phone) {
    //             callData.code = 0
    //             callData.text = "success"
    //             callData.data = {}
    //             callData.data.point = e.data.point
    //             callData.data.balance = e.data.balance
    //             callData.data.discount = e.data.discount
    //         }
    //     }
    // }
    return callData

}

module.exports = YinbaoUpdateCustomer;