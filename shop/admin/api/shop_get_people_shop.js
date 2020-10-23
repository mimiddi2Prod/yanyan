var db = require("./../utils/dba");

function shopGetPeopleShop() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select * from `user` where register_time >= ? and register_time <= ? order by register_time"
            row = await db.Query(sql, [new Date(param['start_time']), new Date(param['end_time'])])
            if (row.length > 0) {
                data.people = row
            }

            // sql = "select count(id) from `user` where phone > 0"
            // row = await db.Query(sql)
            // if (row.length > 0) {
            //     data.total = row[0]['count(id)']
            // }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetPeopleShop;