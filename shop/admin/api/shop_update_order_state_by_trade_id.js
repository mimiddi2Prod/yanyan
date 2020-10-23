// var tools = require("./tool");
var db = require("./../utils/dba");

// const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateOrderStateByTradeId() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var data = {}
        var row = []
        var sql = ""
        try {
            sql = "update `order` set state = ? where tradeId = ?"
            row = await db.Query(sql, [3, param['tradeId']])
            data = "更新订单成功"
            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }

    }
}

module.exports = shopUpdateOrderStateByTradeId;