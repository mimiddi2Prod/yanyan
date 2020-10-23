var db = require("./../utils/dba");

function shopGetPanicBuyingTime() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = []
        var row = []
        try {
            sql = "select * from panic_buying_time ORDER BY start_time"
            row = await db.Query(sql)
            if (row.length > 0) {
                data = row
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetPanicBuyingTime;