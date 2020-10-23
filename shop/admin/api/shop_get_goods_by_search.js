var db = require("./../utils/dba");

function shopGetGoodsBySearch() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select * from category where `name` = ?"
            row = await db.Query(sql, param['searchString'])
            if (row.length > 0) {
                let cid = row[0].id
                sql = "select * from `item` where category_id_1 = ? and `state` != ?"
                row = await db.Query(sql, [cid, 2])
                for (let i in row) {
                    row[i].image = JSON.parse(row[i].image)
                    row[i].goods_info = JSON.parse(row[i].goods_info)

                    let lrow = null
                    if (row[i].category_id_1) {
                        sql = "select name,parent_id from category where id = ?"
                        lrow = await db.Query(sql, row[i].category_id_1)
                        row[i].category_name_1 = lrow[0].name

                        sql = "select id from category where id = ?"
                        lrow = await db.Query(sql, lrow[0].parent_id)
                        row[i].category_parent_id = lrow[0].id
                    }

                    sql = "select sum(`number`) from `order` where item_id = ? and state = ?"
                    lrow = await db.Query(sql, [row[i].id, 3])
                    if (lrow[0]['sum(`number`)'] == null) {
                        row[i].volume = 0
                    } else {
                        row[i].volume = lrow[0]['sum(`number`)']
                    }
                }
                data = row
            } else {
                sql = "select * from `item` where"
                let arr = []
                if (param['searchString']) {
                    sql += ' name like ?'
                    arr.push("%" + param['searchString'] + "%")
                }
                sql += ' and state != ?'
                arr.push("2")

                console.info(sql)
                console.info(arr)
                row = await db.Query(sql, arr);

                for (let i in row) {
                    row[i].image = JSON.parse(row[i].image)
					row[i].label = row[i].label ? JSON.parse(row[i].label) : null
                    row[i].goods_info = JSON.parse(row[i].goods_info)

                    let lrow = null
                    if (row[i].category_id_1) {
                        sql = "select name,parent_id from category where id = ?"
                        lrow = await db.Query(sql, row[i].category_id_1)
                        row[i].category_name_1 = lrow[0].name

                        sql = "select id from category where id = ?"
                        lrow = await db.Query(sql, lrow[0].parent_id)
                        row[i].category_parent_id = lrow[0].id
                    }

                    sql = "select sum(`number`) from `order` where item_id = ? and state = ?"
                    lrow = await db.Query(sql, [row[i].id, 3])
                    if (lrow[0]['sum(`number`)'] == null) {
                        row[i].volume = 0
                    } else {
                        row[i].volume = lrow[0]['sum(`number`)']
                    }
                }
                data = row
            }


            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetGoodsBySearch;