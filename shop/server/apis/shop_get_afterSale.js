var tools = require("./../tool");

function SHOPGetAfterSale() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetAfterSale::Run";
        var data = [];
        var response = tool.error.OK;
        var row = [];
        var sql = ''
        if (!param['user_id']) {
            tool.log.warn(name, 'user_id is not defined')
        } else if (param['user_id']) {
            try {
                // 数据库需要加订单号 说明是同一个包裹
                if (param['status'] == 0) {
                    // 拉取 申请售后栏
                    sql = "select item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,select_card_id,discount_price,discount_price_total from `order` where user_id = ? and state >= ? and state <= ? and after_sale_state <= ? ORDER BY update_time desc limit ?,?";
                    row = await query(sql, [param['user_id'], 2, 4, 3, param['last_id'] * 10, 10]);
                } else if (param['status'] == 1) {
                    // 拉取 售后记录栏
                    sql = "select item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,select_card_id,discount_price,discount_price_total from `order` where user_id = ? and state != ? and after_sale_state >= ? and after_sale_state <= ? ORDER BY update_time desc limit ?,?";
                    row = await query(sql, [param['user_id'], 5, 4, 7, param['last_id'] * 10, 10]);
                }
                var rowData = row
                if (rowData.length > 0) {
                    data = rowData
                    for (var i in data) {
                        sql = "select `name`,url,`describe` from item where id = ?"
                        row = await query(sql, data[i].item_id);
                        data[i].name = row[0].name
                        data[i].url = row[0].url
                        data[i].describe = row[0].describe
                    }
                }
            } catch (err) {
                if (err.code) {
                    response = tool.error.ErrorSQL;
                    log.warn(name, "code:", err.code, ", sql:", err.sql);
                } else {
                    log.warn(name, JSON.stringify(response));
                    response = tool.error.ErrorCatch;
                }
            }
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_afterSale",
            }, res);
    }
}

module.exports = SHOPGetAfterSale;
