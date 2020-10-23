// var tools = require("./tool");
var db = require("./../utils/dba");

function shopGetGoodsRefundUserList() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select count(id) from `order` where item_id = ? and state = ?"
            row = await db.Query(sql, [param['goods_id'], 1])
            data.number = row[0]['count(id)']

            sql = "select id,user_id,param_1,param_2,`number`,single_price,after_sale_state,address_text,tel,receiver,tradeid from `order` where item_id = ? and state = ? ORDER BY after_sale_state limit ?,?"
            row = await db.Query(sql, [param['goods_id'], 1, param['last_id'] * 5, 5])
            if (row.length > 0) {
                data.userList = row

                for (let i in data.userList) {
                    sql = "select user_name,avatar from `user` where id = ?"
                    row = await db.Query(sql, data.userList[i].user_id)
                    if (row.length > 0) {
                        data.userList[i].avatar = row[0].avatar
                        data.userList[i].user_name = row[0].user_name
                    }
                }

            } else {
                data.userList = []
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetGoodsRefundUserList;