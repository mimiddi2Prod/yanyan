var tools = require("./../tool");

function SHOPDelAddress() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPDelAddress::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["user_id"]) {
            tool.log.warn(name, 'user_id is not defined')
        } else if (param["address_id"]) {
            var row = [];
            try {
                var sql = "delete from address where id = ?"
                row = await tool.query(sql, param["address_id"])
                data.text = '删除成功'
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPDelAddress::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else {
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "del_address",
            }, res);
    }
}

module.exports = SHOPDelAddress;
