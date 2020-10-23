var tools = require("./../tool");

function SHOPGetIntegral() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPGetIntegral::Run";
        var data = [];
        var response = tool.error.OK;
        if (!param["user_id"]) {
            tool.log.warn(name, 'op_id is not defined')
        } else if (param["user_id"]) {
            var row = [];
            var sql = ""
            try {
                sql = "select integral from `user` where id = ?"
                row = await tool.query(sql, param["user_id"])
                if (row.length > 0) {
                    row[0].integral = ((row[0].integral * 100) >> 0) / 100
                    data = row
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPGetIntegral::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else {
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_integral",
            }, res);
    }
}

module.exports = SHOPGetIntegral;
