var db = require("./../utils/dba");

function shopGetPeople() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select * from `restaurant_user` where register_time >= ? and register_time <= ? order by register_time"
            row = await db.Query(sql, [new Date(param['start_time']), new Date(param['end_time'])])
            if (row.length > 0) {
                data.people = row
            }

            sql = "select count(id) from `restaurant_user` where phone > 0"
            row = await db.Query(sql)
            if (row.length > 0) {
                data.total = row[0]['count(id)']
            }

            // sql = "select * from `restaurant_user` where register_time >= ? and register_time <= ? and phone != '' order by register_time"
            // row = await db.Query(sql, [new Date(param['start_time']), new Date(param['end_time'])])
            // if (row.length > 0) {
            //     data.member = row
            // }
            // sql = "select * from aftersale where state = ? and order_id in (select id from `order` where after_sale_state >= ?) and create_time >= ? and create_time <= ? order by create_time"
            // row = await db.Query(sql, [0, 4, param['start_time'], param['end_time']])
            // if (row.length > 0) {
            //     data.refund = row
            // }


            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetPeople;