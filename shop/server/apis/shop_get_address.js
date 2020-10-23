var tools = require("./../tool");

function SHOPGetAddress() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPGetAddress::Run";
        var data = [];
        var response = tool.error.OK;
        if (!param["user_id"]) {
            tool.log.warn(name, 'user_id is not defined')
        } else if (param["user_id"]) {
            var row = [];
            var sql = ""
            try {
                sql = "select receiver,tel,province,city,area,road,id,adres,adreslat,adreslng from address where user_id = ?"
                row = await tool.query(sql, param["user_id"])
                if (row.length > 0) {
                    data = row
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPGetAddress::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else {
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "add_address",
            }, res);
    }
}

module.exports = SHOPGetAddress;
