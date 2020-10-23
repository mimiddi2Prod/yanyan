var db = require("./../utils/dba");

function shopUpdatePanicBuyingTime() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "update panic_buying_time set week = ?,start_time = ?,end_time = ?,user_id = ? where id = ?";
            row = await db.Query(sql, [param['week'], param['start_time'], param['end_time'], param['user_id'], param['id']]);
            console.info(row)
            if (row.changedRows == 1) {
                data.text = '编辑成功'
            } else {
                data.text = '编辑失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdatePanicBuyingTime;