// var db = require("./../utils/dba");
var db = require("./../utils/dba");

function shopAddLogisticsCodeToOrder() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (!param['logistics_code']) {
                console.info('logistics_code没有获取到')
            } else if (!param['logistics_order_id']) {
                console.info('logistics_order_id没有获取到')
            } else {
                sql = "update `order` set logistics_code = ? where id = ?";
                row = await db.Query(sql, [param['logistics_code'], param['logistics_order_id']]);
                if (row.changedRows == 1) {
                    data.text = '添加运输单号成功'
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopAddLogisticsCodeToOrder;