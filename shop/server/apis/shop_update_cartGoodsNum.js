var tools = require("./../tool");

function SHOPUpdateCartGoodsNum() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPUpdateCartGoodsNum::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["user_id"]) {
            // 用户id可能不需要传 cart的id为唯一对应的
            tool.log.warn(name, 'user_id is not defined')
        } else if (param["cart_id"] && param["number"]) {
            var row = [];
            try {
                var sql = "update cart set number = ? where id = ?"
                row = await tool.query(sql, [param["number"], param["cart_id"]])
                if (row.changedRows == 1) {
                    data.text = "更改商品数量成功"
                }else{
                    data.text = "没有改动"
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPGetCart::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else {
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "update_cartGoodsNum",
            }, res);
    }
}

module.exports = SHOPUpdateCartGoodsNum;
