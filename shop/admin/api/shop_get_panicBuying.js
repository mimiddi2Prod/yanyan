var db = require("./../utils/dba");

function shopGetPanicBuying() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['last_id'].toString().length <= 0) {
                // 分页
                console.info('last_id未获取')
            } else {
                // sql = "select count(id) from item where `type` = ? and state = ? and panic_buying_time_id = ?";
                // row = await db.Query(sql, [3, 0, param['panic_buying_time_id']]);
                sql = "select count(id) from item where state = ? and panic_buying_time_id = ?";
                row = await db.Query(sql, [0, param['panic_buying_time_id']]);
                data.number = row[0]['count(id)']

                // sql = "select id,name,image,`type`,sort,create_time,`describe`,price,panic_buying_id from item where `type` = ? and state = ? and panic_buying_time_id = ? ORDER BY sort limit ?,?"
                // row = await db.Query(sql, [3, 0, param['panic_buying_time_id'], param['last_id'] * 5, 5])
                sql = "select id,name,image,`type`,sort,create_time,`describe`,price,panic_buying_id from item where state = ? and panic_buying_time_id = ? ORDER BY sort limit ?,?"
                row = await db.Query(sql, [0, param['panic_buying_time_id'], param['last_id'] * 5, 5])
                if (row.length > 0) {
                    for (let i in row) {
                        if (row[i].image.length > 0) {
                            row[i].image = JSON.parse(row[i].image)[0]
                        }
                    }
                    data.list = row
                }

                if (param['panic_buying_time_id'] != 0) {
                    console.info(data.list)
                    for (let i in data.list) {
                        sql = "select panic_buying_price,id from panic_buying where id = ?"
                        row = await db.Query(sql, data.list[i].panic_buying_id)
                        console.info(row)
                        data.list[i].panic_buying_price = row[0].panic_buying_price
                        data.list[i].panic_buying_id = row[0].id
                    }
                }
            }
            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetPanicBuying;