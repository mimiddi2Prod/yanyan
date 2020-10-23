var db = require("./../utils/dba");

function shopUpdateGoodsValue() {
    this.Service = async function (version, param, callback) {
        var data = {}
        var row = []
        var sql = ""
        try {
            sql = "update item set price = ?,stock = ?,sort2 = ?,`limit` = ? where id = ?"
            row = await db.Query(sql, [param['price'], param['stock'], param['sort2'], param['limit'], param['id']])
            if (row.changedRows == 1) {
                data.text = "更新成功"
            }

            // if (param['type'] == 'price') {
            //     sql = "update item set price = ? where id = ?"
            // } else if (param['type'] == 'stock') {
            //     sql = "update item set stock = ? where id = ?"
            // } else if (param['type'] == 'sort2') {
            //     sql = "update item set sort2 = ? where id = ?"
            // } else if (param['type'] == 'limit') {
            //     sql = "update item set `limit` = ? where id = ?"
            // }
            // row = await db.Query(sql, [param['value'], param['goods_id']])
            // if (row.changedRows == 1) {
            //     data.text = "更新成功"
            // }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }

    }
}

module.exports = shopUpdateGoodsValue;