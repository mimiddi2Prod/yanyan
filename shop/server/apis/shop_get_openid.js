var tools = require("./../tool");
var https = require('https');
const appid = require('./../config/wxConfig').appid;
const secret = require('./../config/wxConfig').secret;

function SHOPGetOpenId() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetOpenId::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["code"]) {
            log.warn('没有用户登录凭证code')
        } else {
            try {
                var options = {
                    host: 'api.weixin.qq.com',
                    path: '/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + param["code"] + '&grant_type=authorization_code',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                async function Call() {
                    var e = await HttpsGet(options)
                    let openid = JSON.parse(e).openid
                    let sessionkey = JSON.parse(e).session_key
                    var sql = 'select id,phone,integral from `user` where open_id = ?'
                    var row = await query(sql, openid)
                    let rowData = row
                    if (rowData.length <= 0) {
                        let ctime = new Date()
                        sql = 'insert into `user` (open_id,session_key,register_time,last_login_time)values(?,?,?,?)'
                        row = await query(sql, [openid, sessionkey,ctime,ctime])
                        data.user_id = row.insertId
                        data.is_new_customer = true
                    } else {
                        data.user_id = row[0].id
                        data.integral = ((rowData[0].integral * 100) >> 0) / 100
                        sql = 'update `user` set session_key = ? where open_id = ?'
                        row = await query(sql, [sessionkey, openid])
                    }

                    data.openid = openid
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
        }

        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_openid",
            }, res);
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

module.exports = SHOPGetOpenId;
