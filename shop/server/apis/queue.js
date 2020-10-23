var tools = require("./../tool");

function queue() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "queue::Run";
        var data = {};
        var response = tool.error.OK;
        var sql = '', row = [];
        if (param['token'].length <= 0) {
            console.info('没有收到排队用token')
        } else {
            try {
                sql = "select id from shop_queue where token = ?"
                row = await query(sql, param['token'])
                if (row.length <= 0) {
                    // 没有找到就插入
                    sql = "insert into shop_queue(token,create_time,update_time)values(?,current_timestamp,current_timestamp)"
                    row = await query(sql, param['token'])
                } else {
                    // 有一直在排队 更新排队时间
                    sql = "update shop_queue set update_time = current_timestamp where token = ?"
                    row = await query(sql, param['token'])
                }

                // 如果排队时间在前n个内有 则进入首页 否则继续等待并根据上半部份代码刷新等待时间
                let current_time = new Date().getTime()
                let expired_time = new Date(current_time - (5 * 60 * 1000))
                sql = "select * from shop_queue where update_time > ? and update_time <= current_timestamp limit 500"
                row = await query(sql, expired_time)
                if (row.length > 0) {
                    let bool = row.some(function (eData) {
                        if (eData.token == param['token']) {
                            return true
                        }
                        return false
                    })
                    if (bool) {
                        data.code = 1
                    } else {
                        data.code = 0
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
                action: "queue",
            }, res);
    }
}

module.exports = queue;
