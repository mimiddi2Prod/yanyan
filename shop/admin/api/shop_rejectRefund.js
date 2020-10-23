var db = require("./../utils/dba");

function shopRejectRefund() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select * from after_sale_notice where user_id = ?";
            row = await db.Query(sql, param['user_id'])
            console.info(row)
            if (row.length <= 0) {
                sql = "insert into after_sale_notice(user_id,have_after_sale_notice)values(?,?)"
                row = await db.Query(sql, [param["user_id"], 1])
                // sql = "update after_sale_notice set have_after_sale_notice = ? where id = ?";
                // row = await db.Query(sql, [1, row[0].id])
            }
            // else {
            //
            // }

            sql = "update `order` set after_sale_state = ? where id = ?";
            row = await db.Query(sql, [7, param['order_id']]);
            console.info(row)
            if (row.changedRows == 1) {
                data.code = 0
                data.text = '退款已拒绝'
            } else {
                data.code = 1
                data.text = '退款拒绝失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopRejectRefund;