var db = require("./../utils/dba");

function shopUpdatePanicBuyingTime() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "update panic_buying set panic_buying_time_id = ?,panic_buying_price = ? where id = ?";
            row = await db.Query(sql, [param['panic_buying_time_id'], param['panic_buying_price'], param['panic_buying_id']]);
            let change_1 = row.changedRows

            sql = "update item set panic_buying_time_id = ? where id = ?"
            row = await db.Query(sql, [param['panic_buying_time_id'], param['item_id']])
            let change_2 = row.changedRows

            console.info(row)
            if (change_1 == 1 || change_2 == 1) {
                data.code = 1
                data.text = '编辑成功'
            } else {
                data.code = 0
                data.text = '编辑失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdatePanicBuyingTime;