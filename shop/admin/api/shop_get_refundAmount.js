var db = require("./../utils/dba");

function shopGetRefundAmount() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select sum(total_refund) from aftersale where state = ? and order_id in (select id from `order` where after_sale_state >= ?)"
            row = await db.Query(sql, [0, 4]);
            let total_refund = row[0]['sum(total_refund)']

            data.number = Number(total_refund).toFixed(2)

            sql = "select * from yinbao_refund"
            row = await db.Query(sql)
            if (row.length > 0) {
                let yinbaoRefund = 0
                for (let i in row) {
                    yinbaoRefund = yinbaoRefund + Number(row[i].total_refund)
                }
                data.number = Number(Number(data.number) + yinbaoRefund).toFixed(2)
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetRefundAmount;