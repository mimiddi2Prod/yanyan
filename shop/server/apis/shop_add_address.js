var tools = require("./../tool");

function SHOPAddAddress() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPAddAddress::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["user_id"]) {
            tool.log.warn(name, 'user_id is not defined')
        } else if (param["user_id"]) {
            var row = [];
            var sql = ""
            try {
                sql = "insert into address(receiver,tel,adres,adreslat,adreslng,road,user_id,create_time)values(?,?,?,?,?,?,?,CURRENT_TIMESTAMP)"
                row = await tool.query(sql, [param["receiver"], param["tel"], param["adres"], param["adreslat"], param["adreslng"], param["road"], param["user_id"]])
                if (row.insertId) {
                    data.text = "添加地址成功"
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPAddAddress::Run", "code:", err.code, ", sql:", err.sql);
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

module.exports = SHOPAddAddress;
