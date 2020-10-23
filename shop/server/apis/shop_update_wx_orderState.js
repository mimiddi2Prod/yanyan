var tools = require("./../tool");

async function SHOPUpdateWxOrderState(param) {
    var tool = new tools;

    var data = {};
    var sql = '', row = [];

    if (!param["old_trade_id"]) {
        tool.log.warn(name, 'old_trade_id is not defined')
    } else if (param["old_trade_id"]) {
        if (param["trade_id"]) {
            sql = "update `order` set state = ?,tradeId = ? where tradeId = ?"
            row = await tool.query(sql, [param["state"], param["trade_id"], param["old_trade_id"]])
        }
        if (row.changedRows == 1) {
            data.text = "更新订单成功"
            data.updateOrderStatus = 0
        }
        return data
    }
}

module.exports = SHOPUpdateWxOrderState;