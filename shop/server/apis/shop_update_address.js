var tools = require("./../tool");

function SHOPUpdateAddress() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPUpdateAddress::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["address_id"]) {
            tool.log.warn(name, 'address_id is not defined')
        } else if (!param["road"]) {
            tool.log.warn(name, 'road is not defined')
        } else if (!param["adres"]) {
            tool.log.warn(name, 'adres is not defined')
        } else if (!param["tel"]) {
            tool.log.warn(name, 'tel is not defined')
        } else if (param["receiver"]) {
            var row = [];
            try {
                var sql = "update address set receiver = ?,tel = ?,adres = ?,adreslat = ?,adreslng = ?,road = ? where id = ?"
                row = await tool.query(sql, [param["receiver"], param["tel"], param["adres"], param["adreslat"], param["adreslng"], param["road"], param["address_id"]])
                if (row.changedRows == 1) {
                    data.text = "更新地址成功"
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPUpdateAddress::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else {
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "update_address",
            }, res);
    }
}

module.exports = SHOPUpdateAddress;
