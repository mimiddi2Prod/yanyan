var yinbaoAppId = require('./../config/yinbaoConfig').appId
var request = require('../utils/yinbaoRequest')
var fm = require('./../utils/formatTime')
var jsonBigInt = require('json-bigint')({"storeAsString": true});


async function YinbaoGetTicket(data) {
    data['start_time'] = fm(new Date(data['start_time']))
    data['end_time'] = fm(new Date(data['end_time']))
    console.info(data)
    let callData = {}
    // 1.分页查询所有单据
    let postData = {
        "appId": yinbaoAppId,
        "startTime": data['start_time'],
        "endTime": data['end_time'],
    }
    if(data.postBackParameter){
        postData.postBackParameter = data.postBackParameter
    }
    let postDataJson = JSON.stringify(postData)
    let router = "queryTicketPages"
    let e = await request(router, postDataJson)

    e = jsonBigInt.parse(e)
    // console.info("获得分类数据：")
    // console.info(e)
    // console.info(e.data.result)

    for (let i in e.data.result) {
        // console.info(e.data.result[i].items)
        // e.data.result[i].cashierUid = e.data.result[i].cashierUid.c.join("")
        // e.data.result[i].cashier.uid = e.data.result[i].cashier.uid.c.join("")
        e.data.result[i].cashier = JSON.stringify(e.data.result[i].cashier)
        // e.data.result[i].uid = e.data.result[i].uid.c.join("")
        // if(e.data.result[i].customerUid){
        //     e.data.result[i].customerUid = e.data.result[i].customerUid.c.join("")
        // }
        // for(let j in e.data.result[i].items){
        //     e.data.result[i].items[j].productUid = e.data.result[i].items[j].productUid.c.join("")
        // }
        e.data.result[i].datetime = new Date(e.data.result[i].datetime)

        e.data.result[i].items = JSON.stringify(e.data.result[i].items)
        e.data.result[i].payments = JSON.stringify(e.data.result[i].payments)
    }
    callData = e
    return callData

}

module.exports = YinbaoGetTicket;