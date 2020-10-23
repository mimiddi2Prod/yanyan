var db = require("./../utils/dba");

function shopAddPanicBuying() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "insert into panic_buying(panic_buying_time_id,item_id,panic_buying_price,create_time,user_id)values(?,?,?,CURRENT_TIMESTAMP,?)";
            row = await db.Query(sql, [param['panic_buying_time_id'], param['item_id'], param['panic_buying_price'], param['user_id']]);
            if (row.insertId) {
                data.text = '添加成功'
                data.code = 1

                sql = "update item set panic_buying_id = ?,panic_buying_time_id = ? where id = ?"
                row = await db.Query(sql, [row.insertId, param['panic_buying_time_id'], param['item_id']])
            } else {
                data.text = '添加失败'
                data.code = 0
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopAddPanicBuying;