var db = require("./../utils/dba");

function shopGetPosition() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['last_id'] >= 0) {
                sql = "select count(id) from `position`";
                row = await db.Query(sql, 0);
                data.number = row[0]['count(id)']

                sql = "select id,`name`,`desc`,goods_manage,order_manage,info_manage,user_manage,order_update_price,order_refund,order_other from `position` limit ?,?"
                row = await db.Query(sql, [param['last_id'] * 4, 4])

                if (row.length > 0) {
                    data.positionDetailList = row
                }
            } else if (param['last_id'] == -1) {
                sql = "select id,`name`,`desc`,goods_manage,order_manage,info_manage,user_manage,order_update_price,order_refund,order_other from `position`"
                row = await db.Query(sql)

                if (row.length > 0) {
                    data.positionDetailList = row
                }
            } else {
                sql = "select id,`name` from `position`"
                row = await db.Query(sql)

                if (row.length > 0) {
                    data.positionList = row
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetPosition;