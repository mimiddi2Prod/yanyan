var tools = require("./../tool");

function SHOPAddCart() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPAddCart::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["user_id"]) {
            tool.log.warn(name, 'user_id is not defined')
        } else if (param["item_id"]) {
            var row = [];
            var sql = ""
            try {
                sql = "select stock,`limit` from item where id = ?"
                row = await tool.query(sql, [param["item_id"]]);
                if (row[0].stock <= 0) {
                    data.text = "添加商品超出库存量"
                } else {
                    sql = "select user_id,`number` from cart where user_id = ? and item_id = ?"
                    row = await tool.query(sql, [param["user_id"], param['item_id']])
                    var rowData = row
                    if (rowData.length <= 0) {
                        sql = "insert into cart(user_id,item_id,`number`,create_time)values(?,?,?,CURRENT_TIMESTAMP)"
                        row = await tool.query(sql, [param["user_id"], param["item_id"], param["number"]]);
                        data.text = "添加成功"
                    } else {
                        var number = rowData[0].number
                        sql = "select stock,`limit` from item where id = ?"
                        row = await tool.query(sql, [param["item_id"]]);
                        // 减少购物车
                        if (param["number"] == -1) {
                            let m = param["number"] + number
                            if (m > 0) {
                                sql = "update cart set `number` = ? where user_id = ? and item_id = ?"
                                row = await tool.query(sql, [m, param["user_id"], param["item_id"]]);
                            } else {
                                sql = "delete from cart where user_id = ? and item_id = ?"
                                row = await tool.query(sql, [param["user_id"], param["item_id"]]);
                            }
                            data.text = "添加成功"
                        } else if (row[0].stock >= number + param["number"]) {
                            if (row[0].limit < number + param["number"]) {
                                data.text = "无法继续添加了"
                            } else {
                                sql = "update cart set `number` = ? where user_id = ? and item_id = ?"
                                row = await tool.query(sql, [param["number"] + number, param["user_id"], param["item_id"]]);
                                data.text = "添加成功"
                            }
                        } else {
                            data.text = "添加商品超出库存量"
                        }
                    }
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPAddCart::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else {
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "add_cart",
            }, res);
    }
}

module.exports = SHOPAddCart;
