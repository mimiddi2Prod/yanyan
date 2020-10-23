var tools = require("./../tool");

function SHOPUpdateAfterSaleState() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPUpdateAfterSaleState::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["order_id"]) {
            tool.log.warn(name, 'order_id is not defined')
        } else if (param["order_id"]) {
            var row = [];
            var sql = ''
            try {
                // 先检查订单的售后状态，防止用户停留在页面，保持‘取消订单’按钮一直处于可点击状态
                sql = "select after_sale_state from `order` where id = ?"
                row = await tool.query(sql, param["order_id"])
                if(row[0].after_sale_state >= 1 && row[0].after_sale_state <= 3){
                    sql = "update `order` set after_sale_state = ? where id = ?"
                    row = await tool.query(sql, [param["after_sale_state"], param["order_id"]])
                    if (row.changedRows == 1) {
                        data.text = "更新售后申请成功"
                        // 取消订单
                        sql = "update aftersale set state = ? where order_id = ?"
                        row = await tool.query(sql, [1, param["order_id"]])
                    }
                }else{
                    data.text = "售后申请取消失败"
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPUpdateAfterSaleState::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else {
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "update_afterSale",
            }, res);
    }
}

module.exports = SHOPUpdateAfterSaleState;
