var db = require("./../utils/dba");
var appId = require('./../config/yinbaoConfig').appId
var request = require('../utils/yinbaoRequest')
var jsonBigInt = require('json-bigint')({"storeAsString": true});


function YinbaoGetAPIAccessTimes() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            let begin_time = new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000))
            let current_time = new Date()
            let beginDate = begin_time.getFullYear() + '-' + Number(begin_time.getMonth() + 1) + '-' + begin_time.getDate()
            let endDate = current_time.getFullYear() + '-' + Number(current_time.getMonth() + 1) + '-' + current_time.getDate()
            // 获得当日银豹接口使用量
            let postData = {
                "appId": appId,
                "beginDate": beginDate,
                "endDate": endDate
            }
            let postDataJson = JSON.stringify(postData)
            let router = "queryDailyAccessTimesLog"
            let e = await request(router, postDataJson)
            e = jsonBigInt.parse(e)
            console.info("获得api连接剩余次数：")
            console.info(e)
            if (e.status == 'success' && e.data.length > 0) {
                data.code = 1
                for (let i in e.data) {
                    delete (e.data[i]["appId"])
                }
                data.data = e.data
            }else{
                data.code = 0
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = YinbaoGetAPIAccessTimes;