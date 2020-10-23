var db = require("./../utils/dba");

function shopGetWaterfallBySearch() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['searchString'].length <= 0) {
                // 分页
                console.info('searchString未获取')
            } else if (param['type'].toString().length <= 0) {
                // type 0瀑布流 1专题精选 2不在首页展示
                console.info('type未获取')
            } else {
                sql = "select * from category where `name` = ?"
                row = await db.Query(sql, param['searchString'])
                if (row.length > 0) {
                    let cid = row[0].id
                    sql = "select * from `item` where category_id_1 = ? and `type` = ? and state = ? ORDER BY sort"
                    row = await db.Query(sql, [cid, param['type'], 0])
                    for (let i in row) {
                        row[i].image = JSON.parse(row[i].image)
                    }
                    data.list = row
                } else {
                    sql = "select * from `item` where"
                    let arr = []
                    if (param['searchString']) {
                        sql += ' name like ?'
                        arr.push("%" + param['searchString'] + "%")
                    }
                    sql += ' and state = ? and `type` = ?'
                    arr.push("0")
                    arr.push(param["type"])

                    console.info(sql)
                    console.info(arr)
                    row = await db.Query(sql, arr);

                    for (let i in row) {
                        row[i].image = JSON.parse(row[i].image)
                    }
                    data.list = row
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetWaterfallBySearch;