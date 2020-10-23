var db = require("./../utils/dba");

function shopGetSales() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // 销售减售后
			// sql = "select count(id),postage,tradeId,create_time from `order` where id in (select order_id from paid where state = ?) and pay_state = ? group by tradeId"
			// row = await db.Query(sql, [1, 0])
            // let total_price = 0
            // let t = row
            // if (t.length > 0) {
            //     for (let i in t) {
            //         sql = "select single_price,discount_price,`number` from `order` where tradeId = ?"
            //         row = await db.Query(sql, t[i].tradeId)
            //         for (let j in row) {
            //             total_price = (Number(total_price) + (row[j].discount_price ? row[j].discount_price * row[j].number : row[j].single_price * row[j].number)).toFixed(2)
            //         }
            //         total_price = (Number(total_price) + t[i].postage).toFixed(2)
            //     }
            // }
            // data.total_price = total_price
            //
            // sql = "select count(id),postage,tradeId from `order` where state >= ? and state != ? and pay_state = ? group by tradeId"
            // row = await db.Query(sql, [1,5, 1])
            // let total_balance_price = 0
            // let tb = row
            // if (t.length > 0) {
            //     for (let i in tb) {
            //         sql = "select single_price,discount_price,`number` from `order` where tradeId = ?"
            //         row = await db.Query(sql, tb[i].tradeId)
            //         for (let j in row) {
            //             total_balance_price = (Number(total_balance_price) + (row[j].discount_price ? row[j].discount_price * row[j].number : row[j].single_price * row[j].number)).toFixed(2)
            //         }
            //         total_balance_price = (Number(total_balance_price) + t[i].postage).toFixed(2)
            //     }
            // }
            // data.total_balance_price = total_balance_price
            //
            // sql = "select sum(total_refund) from aftersale where state = ? and order_id in (select id from `order` where after_sale_state >= ? and after_sale_state <= ?)"
            // row = await db.Query(sql, [0, 4, 6]);
            // let total_refund = row[0]['sum(total_refund)'] ? row[0]['sum(total_refund)'] : 0
            // data.total_refund = total_refund

			sql = "select count(id),postage,create_time,select_card_id,tradeId from `order` where  pay_state = ? and create_time >= ? and create_time <= ? group by tradeId order by create_time"
            row = await db.Query(sql, [1, new Date(param['start_time']), new Date(param['end_time'])])
            if (row.length > 0) {
                data.order = row
                for (let i in data.order) {
                    sql = "select single_price,discount_price,discount_price_total,total_price,`number` from `order` where tradeId = ?"
                    row = await db.Query(sql, data.order[i].tradeId)
                    let total_price = 0
                    for (let j in row) {
                        total_price = (Number(total_price) + (row[j].discount_price_total ? row[j].discount_price_total : row[j].total_price)).toFixed(2)
                    }
                    data.order[i].total_price = (Number(total_price) + data.order[i].postage).toFixed(2)
                }
            } else {
                data.order = []
            }

            // 退款
            // sql = "select * from aftersale where state = ? and order_id in (select id from `order` where after_sale_state >= ?) and create_time >= ? and create_time <= ? order by create_time"
            // row = await db.Query(sql, [0, 4, new Date(param['start_time']), new Date(param['end_time'])])
            // if (row.length > 0) {
            //     data.refund = row
            // } else {
            //     data.refund = []
            // }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetSales;

