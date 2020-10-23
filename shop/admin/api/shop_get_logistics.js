var db = require("./../utils/dba");
var https = require('https');

function shopGetLogistics() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // const appcodeName = 'APPCODE'
            // const appcode = 'f629fec81eca489f95e07fb709d93e02'
            // // no 快递单号 【顺丰请输入单号: 收件人或寄件人手机号后四位。例如：123456789: 1234】
            // // type 快递公司字母简写：不知道可不填 95 % 能自动识别，填写查询速度会更快【见产品详情】
            //
            // var options = {
            //     host: 'wuliu.market.alicloudapi.com',
            //     path: '/kdi?no=' + param['logistics_code'],
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': appcodeName + " " + appcode
            //     }
            // };
            //
            // async function Call() {
            //     var e = await HttpsGet(options)
            //     console.info(e)
            //     data = JSON.parse(e)
            // }
            //
            // await Call()

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

async function HttpsGet(option) {
    return new Promise(function (resolve, reject) {
        https.get(option, function (res) {
            let data = ''
            res.on('data', function (chunk) {
                data += chunk;
            })
            res.on('end', function (e) {
                resolve(data)
            })
        })
    })
}

module.exports = shopGetLogistics;