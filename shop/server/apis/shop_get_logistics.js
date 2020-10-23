var tools = require("./../tool");
var https = require('https');

function SHOPGetLogistics() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetLogistics::Run";
        log.debug("SHOPGetLogistics::Run.in");
        var data = [];
        var response = tool.error.OK;
        var row = [];
        try {
            const appcodeName = 'APPCODE'
            const appcode = 'f629fec81eca489f95e07fb709d93e02'
            // no 快递单号 【顺丰请输入单号: 收件人或寄件人手机号后四位。例如：123456789: 1234】
            // type 快递公司字母简写：不知道可不填 95 % 能自动识别，填写查询速度会更快【见产品详情】

            var options = {
                host: 'wuliu.market.alicloudapi.com',
                path: '/kdi?no=' + param['no'],
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': appcodeName + " " + appcode
                }
            };

            async function Call() {
                var e = await HttpsGet(options)
                console.info(e)
                data = JSON.parse(e)
            }

            await Call()
        } catch (err) {
            if (err.code) {
                response = tool.error.ErrorSQL;
                log.warn(name, "code:", err.code, ", sql:", err.sql);
            } else {
                log.warn(name, JSON.stringify(response));
                response = tool.error.ErrorCatch;
            }
        }

        if (response.code != tool.error.OKCode) {
            log.warn(name, JSON.stringify(response));
        }

        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_logistics",
            }, res);
        tool.log.debug("SHOPGetLogistics::Run.out");
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

module.exports = SHOPGetLogistics;