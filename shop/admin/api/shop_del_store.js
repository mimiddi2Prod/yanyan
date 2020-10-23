var db = require("./../utils/dba");

function shopDelStore() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "delete from store where id = ?";
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

module.exports = shopDelStore;