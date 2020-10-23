// var tools = require("./tool");
var db = require("./../utils/dba");
// const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateOrderState() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var data = {}
        var row = []
        var sql = ""
        try {
            sql = "update `order` set state = ? where id = ?"
            row = await db.Query(sql, [param["state"], param["order_id"]])
            // if (row.changedRows == 1) {
            //     data.text = "更新订单成功"
            //     if (param['state'] == -1) {
            //         // 取消订单
            //         sql = "delete from paid where order_id = ?"
            //         row = await tool.query(sql, param["order_id"])
            //     } else if (param['state'] == 1) {
            //         // 已支付
            //         sql = "update paid set state = ? where order_id = ?"
            //         row = await tool.query(sql, [1, param["order_id"]])
            //     }
            // }
            data = "更新订单成功"
            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }

    }
}

module.exports = shopUpdateOrderState;