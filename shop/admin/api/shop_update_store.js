var db = require("./../utils/dba");

function shopUpdateStore() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "update store set `name` = ? ,machine_code = ?,location = ?,phone = ?,delivery_fee = ?,free_delivery_fee = ?,distance = ?,start_time = ?,end_time = ? where id = ?";
            row = await db.Query(sql, [param['name'], param['machine_code'], param['location'], param['phone'], param['delivery_fee'], param['free_delivery_fee'], param["distance"], param['start_time'], param['end_time'], param['id']]);
            if (row.changedRows == 1) {
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

module.exports = shopUpdateStore;