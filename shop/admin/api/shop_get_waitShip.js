var db = require("./../utils/dba");

function shopGetWaitShip() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['voice']) {
                sql = "select count(id) from `order` where state = ? and after_sale_state = ? and update_time > (select remind_time from remind_time where tag = ?)";
                row = await db.Query(sql, [2, 0, 'order']);
                data.deliveryNumber = row[0]['count(id)']

                sql = "select count(id) from `order` where after_sale_state >= ? && after_sale_state <= ? and update_time > (select remind_time from remind_time where tag = ?)";
                row = await db.Query(sql, [1, 3, 'order']);
                data.afterSaleNumber = row[0]['count(id)']
            } else {
                sql = "select count(id) from `order` where state = ? and after_sale_state = ?";
                row = await db.Query(sql, [2, 0]);
                data.deliveryNumber = row[0]['count(id)']

                sql = "select count(id) from `order` where after_sale_state >= ? && after_sale_state <= ?";
                row = await db.Query(sql, [1, 3]);
                data.afterSaleNumber = row[0]['count(id)']

                let cTime = new Date(),
                    date = cTime.getFullYear() + '-' + (1 + cTime.getMonth()) + '-' + cTime.getDate() + ' 00:00:00'
                sql = "select count(id) from `order` where state >= ? and id in (select order_id from paid where state = ?) and create_time > ? group by tradeId";
                row = await db.Query(sql, [3, 1, new Date(date)]);
                data.todayOrder = row.length
				sql = "select count(id) from `order` where pay_state = ? and create_time > ? group by tradeId";
                row = await db.Query(sql, [1, new Date(date)]);
				data.todayOrder = data.todayOrder + row.length

                sql = "select count(id) from `order` where state >= ? and id in (select order_id from paid where state = ?) group by tradeId";
                row = await db.Query(sql, [3, 1]);
                data.totalOrder = row.length
				sql = "select count(id) from `order` where pay_state = ? group by tradeId";
                row = await db.Query(sql, [1]);
				data.totalOrder = data.totalOrder + row.length
            }
            // data.number = row[0]['count(id)']

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetWaitShip;