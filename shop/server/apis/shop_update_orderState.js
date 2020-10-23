var tools = require("./../tool");

function SHOPUpdateOrderState() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPUpdateOrderState::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [], sql = "";
        try {
            if (param["pay_state"]) {
                sql = "update `order` set state = ?,pay_state = ? where tradeId = ?"
                row = await tool.query(sql, [param["state"], param["pay_state"], param["trade_id"]])
            } else {
                sql = "update `order` set state = ? where tradeId = ?"
                row = await tool.query(sql, [param["state"], param["trade_id"]])
            }

            if (row.changedRows >= 1) {
                data.text = "更新订单成功"
                sql = "select id from `order` where tradeId = ?"
                row = await tool.query(sql, param["trade_id"])
                let order_id_list = row
                if (param['state'] == -1) {
                    // 取消订单
                    sql = "delete from paid where order_id in (?)"
                    row = await tool.query(sql, order_id_list.map(function (e) {
                        return e.id
                    }))
                } else if (param['state'] == 1) {
                    // 已支付
                    sql = "update paid set state = ? where order_id in (?)"
                    row = await tool.query(sql, [1, order_id_list.map(function (e) {
                        return e.id
                    })])
                }
            } else if (param["state"] == 1) {
                data.text = "更新订单成功"
            }
        } catch (err) {
            response = tool.error.ErrorSQL;
            tool.log.error("SHOPUpdateOrderState::Run", "code:", err.code, ", sql:", err.sql);
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "update_orderState",
            }, res);
    }
}

module.exports = SHOPUpdateOrderState;
