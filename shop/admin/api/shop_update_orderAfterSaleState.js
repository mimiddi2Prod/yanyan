var db = require("./../utils/dba");
// var refund = require("./wxRefund");

function shopUpdateOrderAfterSaleState() {
    this.Service = async function (version, param, callback) {
        var data = {}
        var row = []
        var sql = ""
        try {
            var order_id = param['order_id']
            var after_sale_state = param['after_sale_state']

            sql = "update `order` set after_sale_state = ? where id = ?"
            row = await db.Query(sql, [after_sale_state, order_id])
            if (row.changedRows) {
                data.code = 0
                data.text = "售后完成"
            } else {
                data.code = 1
                data.text = "异常错误"
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }

    }
}

module.exports = shopUpdateOrderAfterSaleState;