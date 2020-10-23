var tools = require("./../tool");

function SHOPUpdateDefaultAddress() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPUpdateDefaultAddress::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["user_id"]) {
            tool.log.warn(name, 'user_id is not defined')
        } else if (param["address_id"] != 0) {
            var row = [];
            try {
                var sql = "update user set address_id = ? where id = ?"
                row = await tool.query(sql, [param["address_id"], param["user_id"]])
                if (row.changedRows == 1) {
                    sql = 'select receiver,tel,adres,road,id from address where id = ?'
                    row = await tool.query(sql, param["address_id"])
                    data.text = "更改默认地址成功"
                    data.default_address = row[0]
                    data.default_address.isDefault = true
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPUpdateDefaultAddress::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else if (param["address_id"] == 0) {
            var row = [];
            try {
                var sql = "update user set address_id = ? where id = ?"
                row = await tool.query(sql, [null, param["user_id"]])
                if (row.changedRows == 1) {
                    data.text = "默认地址置空"
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPUpdateDefaultAddress::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else {
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "update_default_address",
            }, res);
    }
}

module.exports = SHOPUpdateDefaultAddress;
