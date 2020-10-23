var db = require("./../utils/dba");
var sql = ""
var row = ""

function WXApi() {
}

WXApi.Init = async function () {
    if (!WXApi.wxConfig) {
        sql = "select * from wechat_config";
        row = await db.Query(sql);
        WXApi.wxConfig = {
            appid: row[0].appid,
            secret: row[0].secret,
            token: row[0].token
        }
    }
    if (!WXApi.api) {
        const WechatAPI = require('wechat-api');
        // WXApi.api = new WechatAPI(appid, secret)
        WXApi.api = new WechatAPI(WXApi.wxConfig.appid, WXApi.wxConfig.secret, function (callback) {
            // 传入一个获取全局token的方法
            // fs.readFile('access_token.txt', 'utf8', function (err, txt) {
            // if (err) {return callback(err);}
            // callback(null, JSON.parse(txt));
            // });
            sql = "select AccessToken from wechat_access_token"
            row = db.Query(sql)
            row.then(function (e) {
                let AccessToken = JSON.parse(e[0].AccessToken)
                callback(null, AccessToken)
            })
        }, function (token, callback) {
            // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
            // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
            // fs.writeFile('access_token.txt', JSON.stringify(token), callback);
            sql = "update wechat_access_token set AccessToken = ?"
            row = db.Query(sql, JSON.stringify(token))
            callback(null)
        });

    }
    // console.info(WXApi)
    // return WXApi.api;

    /*
        多台服务器负载均衡时，ticketToken需要外部存储共享。
        需要调用此registerTicketHandle来设置获取和保存的自定义方法。
    */
    if (!WXApi.TicketHandle) {
        WXApi.TicketHandle = WXApi.api.registerTicketHandle(getTicketToken, saveTicketToken);
    }
}

// getTicketToken
function getTicketToken(type, callback) {
    // settingModel.getItem(type, {key: 'weixin_ticketToken'}, function (err, setting) {
    //     if (err) return callback(err);
    //     callback(null, setting.value);
    // });
    sql = "select Ticket from wechat_ticket where `type` = ?"
    row = db.Query(sql, type)
    row.then(function (e) {
        let Ticket = JSON.parse(e[0].Ticket)
        callback(null, Ticket)
    })
}

// saveTicketToken
function saveTicketToken(type, _ticketToken, callback) {
    // settingModel.setItem(type, {key: 'weixin_ticketToken', value: ticketToken}, function (err) {
    //     if (err) return callback(err);
    //     callback(null);
    // });
    sql = "update wechat_ticket set `type` = ?,Ticket = ?"
    row = db.Query(sql, [type, JSON.stringify(_ticketToken)])
    callback(null)
}

module.exports = WXApi;