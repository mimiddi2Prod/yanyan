var tools = require("./../tool");

function SHOPCheckNewCustomer() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPCheckNewCustomer::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["openid"]) {
            tool.log.warn(name, 'op_id is not defined')
        } else {
            var row = [];
            var sql = ""
            try {
                sql = "select count(id) as number,state from `order` where open_id = ? group by tradeId"
                row = await tool.query(sql, param["openid"])
                let result = row
                let temp = result.filter(function (item) {
                    return item.state > 0
                })
                if (temp.length == 1 && result[result.length - 1].state > 0) {
                    data.isNewCustomer = true
                } else {
                    data.isNewCustomer = false
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPCheckNewCustomer::Run", "code:", err.code, ", sql:", err.sql);
            }
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "check_new_customer",
            }, res);
    }
}

module.exports = SHOPCheckNewCustomer;
