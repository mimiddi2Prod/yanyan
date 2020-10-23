var db = require("./../utils/dba");

// const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateWaterfall() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (!param['type'].toString()) {
                console.info('type没有获取到')
            } else if (!param['id']) {
                console.info('id没有获取到')
            } else {
                // 抢购
                sql = "select panic_buying_id,type from item where id = ?"
                row = await db.Query(sql, param['id'])
                let panic_buying_id = row[0].panic_buying_id
                let type = row[0].type
                if (type == 3) {
                    sql = "update item set panic_buying_id = ?,panic_buying_time_id = ? where id = ?"
                    row = await db.Query(sql, [0, 0, param['id']])

                    sql = "delete from panic_buying where id = ?"
                    row = await db.Query(sql, panic_buying_id)
                }

                sql = "update item set type = ? where id = ?"
                row = await db.Query(sql, [param['type'], param['id']])
                if (row.changedRows == 1) {
                    data.text = '更改成功'
                }


            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateWaterfall;