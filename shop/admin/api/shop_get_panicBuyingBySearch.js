var db = require("./../utils/dba");

function shopGetPanicBuyingBySearch() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['searchString'].toString().length <= 0) {
                // 分页
                console.info('searchString未获取')
                data.list = []
            } else {
                // sql = "select count(id) from item where state = ? and panic_buying_time_id = ?";
                // row = await db.Query(sql, [0, param['panic_buying_time_id']]);
                // data.number = row[0]['count(id)']

                sql = "select id,name,image,`type`,sort,create_time,`describe`,price,panic_buying_id from item where state = ? and panic_buying_time_id = ? and `name` like ? ORDER BY sort"
                row = await db.Query(sql, [0, param['panic_buying_time_id'], "%" + param['searchString'] + "%"])
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

module.exports = shopGetPanicBuyingBySearch;