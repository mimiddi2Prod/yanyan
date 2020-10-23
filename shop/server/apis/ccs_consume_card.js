var tools = require("./../tool");
var http = require("http")

function CCSGetCouponCard() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "CCSGetCouponCard::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["openid"]) {
            tool.log.warn(name, 'openid is not defined')
        } else {
            var row = [];
            var sql = ""
            try {
                sql = "select * from card where id = ?"
                row = await tool.query(sql, param['id'])
                if (row.length > 0) {
                    let current_time = new Date().getTime() / 1000
                    let card_id = row.filter(function (e) {
                        e.cash = JSON.parse(e.cash)
                        if (e.cash.base_info.date_info.type == 'DATE_TYPE_FIX_TIME_RANGE') {
                            return (current_time >= e.cash.base_info.date_info.begin_timestamp && current_time <= e.cash.base_info.date_info.end_timestamp)
                        } else {
                            return true
                        }
                    }).map(function (e) {
                        return e.card_id
                    })
                    if (card_id.length > 0) {
                        // post
                        // 3.签名
                        // 签名生成规则如下：
                        // 将所有参数的value值进行字符串的字典序排序；
                        // 将所有参数字符串拼接成一个字符串进行sha1加密，得到signature；
                        // 自定义code (勾选请确认创建接口中use_custom_code填写为true)；
                        // 指定用户领取 (勾选请确认创建接口中bind_openid填写为true)。
                        var postDataJson = JSON.stringify({
                            openid: param["openid"],
                            card_id: card_id,
                            code: ''
                        })
                        var options = {
                            host: '127.0.0.1',
                            port: '9900',
                            path: '/apis/getCardExt',
                            method: 'POST',
                            form: postDataJson,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                            },
                        }

                        async function Call() {
                            let e = await HttpPost(options, postDataJson)
                            e = JSON.parse(e)
                            if (e.code == 0) {
                                data.cardList = e.data
                            }
                        }

                        await Call()
                    }
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("CCSGetCouponCard::Run", "code:", err.code, ", sql:", err.sql);
            }
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "consume_card",
            }, res);
    }
}

module.exports = CCSGetCouponCard;

async function HttpPost(option, postData) {
    return new Promise(function (resolve, reject) {
        var req = http.request(option, function (res) {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            })
            res.on('end', function (e) {
                resolve(data)
            })
        })
        req.write(postData);
        req.end();
    })
}
