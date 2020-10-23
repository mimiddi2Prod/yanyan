var db = require("./../utils/dba");

function restaurantGetOrderByTime() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        if (!param['start_time'] || !param['end_time']) {
            console.info('查询时间为空')
        } else {
            try {
                let start_time = new Date(param['start_time']), end_time = new Date(param['end_time'])
                sql = 'select trade_id,yinbao_order_no,group_concat(price),group_concat(number),create_time from restaurant_goods_order where create_time > ? and create_time < ? group by yinbao_order_no order by create_time desc'
                row = await db.Query(sql, [start_time, end_time])

                if (row.length > 0) {
                    data.code = 0
                    data.total = row

                    sql = 'select * from restaurant_goods_order where create_time > ? and create_time < ?'
                    row = await db.Query(sql, [start_time, end_time])
                    data.list = row
                } else {
                    data.code = 1
                }

                return callback(data);
            } catch (e) {
                console.info('boom!!!!!!!!!!!!!')
            }
        }

    }
}

module.exports = restaurantGetOrderByTime;

