var db = require("./../utils/dba");

function shopAddPosition() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "insert into `position`(`name`,`desc`,goods_manage,order_manage,info_manage,user_manage,order_update_price,order_refund,order_other,user_id,create_time)values(?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)";
            row = await db.Query(sql, [param['name'], param['desc'], param['goods_manage'], param['order_manage'], param['info_manage'], param['user_manage'], param['order_update_price'], param['order_refund'], param['order_other'], param['user_id']]);
            console.info(row)
            if (row.insertId) {
                data.text = '添加成功'
            } else {
                data.text = '添加失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopAddPosition;