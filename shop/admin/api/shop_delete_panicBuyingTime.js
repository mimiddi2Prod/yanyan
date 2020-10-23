var db = require("./../utils/dba");

function shopDeletePanicBuyingTime() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "update item set panic_buying_id = ?,panic_buying_time_id = ? where panic_buying_time_id = ?"
            row = await db.Query(sql, [0, 0, param['id']])

            sql = "delete from panic_buying_time where id = ?";
            row = await db.Query(sql, param['id']);

            if (row.affectedRows == 1) {
                data.code = 1
                data.text = '删除成功'
            } else {
                data.code = 0
                data.text = '删除失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopDeletePanicBuyingTime;