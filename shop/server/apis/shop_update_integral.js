var tools = require("./../tool");

function SHOPUpdateIntegral() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPUpdateIntegral::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["integral"]) {
            tool.log.warn(name, 'integral is not defined')
        } else if (!param["user_id"]) {
            tool.log.warn(name, "user_id is not defined");
        } else {
            var row = [];
            try {
                var sql = "select integral from `user` where id = ?"
                row = await tool.query(sql, param["user_id"])
                if (row.length > 0) {
                    let currentIntegral = row[0].integral
                    // 0相加 1相减
                    currentIntegral = parseFloat((Number(currentIntegral) + Number(param["integral"])).toPrecision(12))
                    sql = "update `user` set integral = ? where id = ?"
                    row = await tool.query(sql, [currentIntegral, param["user_id"]])
                    if (row.changedRows == 1) {
                        data.text = "积分更新成功"
                    }
                }

            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPUpdateIntegral::Run", "code:", err.code, ", sql:", err.sql);
            }
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "update_address",
            }, res);
    }
}

module.exports = SHOPUpdateIntegral;
