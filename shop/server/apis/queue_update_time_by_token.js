var tools = require("./../tool");

function queueUpdateTimeByToken() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "queueUpdateTimeByToken::Run";
        var data = {};
        var response = tool.error.OK;
        var sql = '', row = [];
        if (param['token'].length <= 0) {
            console.info('没有收到排队用token')
        } else {
            try {
                sql = "select * from shop_queue where token = ?"
                row = await query(sql, param['token'])
                if (row.length <= 0) {
                    data.code = 0
                    data.text = '没有对应的token,重新运行'
                } else {
                    // 小程序处于后台 程序不运行 则token不会被发送过来，就不会更新时间，如果最后更新时间跟当前时间差5分钟 则重新排队
                    let current_time = new Date().getTime()
                    let update_time = new Date(row[0].update_time).getTime()
                    let expired_time = update_time + (5 * 60 * 1000)
                    if (current_time > expired_time) {
                        data.code = 0
                        data.text = "token已过期,重新排队"
                    } else {
                        data.code = 1
                        data.text = "token没有过期"

                        sql = "update shop_queue set update_time = current_timestamp where token = ?"
                        row = await query(sql, param['token'])
                    }
                }

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
                action: "queue_update_time_by_token",
            }, res);
    }
}

module.exports = queueUpdateTimeByToken;
