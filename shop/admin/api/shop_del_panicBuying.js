var db = require("./../utils/dba");

function shopDelPanicBuying() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "delete from panic_buying where id = ?"
            row = await db.Query(sql, param["pbid"])

            sql = "update item set panic_buying_id = ?,panic_buying_time_id = ? where id = ?"
            row = await db.Query(sql, [0, 0, param['item_id']])
            
            data.text = "取消成功"
            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopDelPanicBuying;