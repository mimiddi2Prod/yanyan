var tools = require("./../tool");

/**
 * 该接口已不再使用
 * @constructor
 */
function SHOPGetOrder() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetOrder::Run";
        var data = [];
        var response = tool.error.OK;
        var row = [];
        var sql = ''
        if (!param['user_id']) {
            tool.log.warn(name, 'user_id is not defined')
        } else if (param['user_id']) {
            try {
                // 数据库需要加订单号 说明是同一个包裹
                if (param['state'] == -1) {
                    // 全部拉取
                    sql = "select item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,integral_price from `order` where user_id = ? ORDER BY update_time desc limit ?,?";
                    row = await query(sql, [param['user_id'], param['last_id'] * 10, 10]);
                } else {
                    // 单个拉取
                    var currentTime = new Date().getTime()
                    var oneHours = 60 * 60 * 1000
                    var time = new Date(currentTime - oneHours)
                    if (param['state'] == 0) {
                        // 客户端待付款栏 只展示一个小时内未付款 全部拉取才展示所有
                        sql = "select item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,integral_price from `order` where user_id = ? and state = ? and create_time > ? ORDER BY update_time desc limit ?,?";
                        row = await query(sql, [param['user_id'], param['state'], time, param['last_id'] * 10, 10]);
                    } else {
                        // 已付款(待发货) 已发货(待收货) 已收货(物流送达七天||买家确认收货)
                        // 物流送达如无法自动更改 需再做个时间判断
                        sql = "select item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,integral_price from `order` where user_id = ? and state = ? and after_sale_state < ? ORDER BY update_time desc limit ?,?";
                        row = await query(sql, [param['user_id'], param['state'], 4, param['last_id'] * 10, 10]);
                    }
                }
                var rowData = row
                if (rowData.length > 0) {
                    data = rowData
                    // for (var i in data) {
                    //     sql = "select `name`,url,`describe` from item where id = ?"
                    //     row = await query(sql, data[i].item_id);
                    //     data[i].name = row[0].name
                    //     data[i].url = row[0].url
                    //     data[i].describe = row[0].describe
                    // }
                    sql = "select `name`,url,`describe` from item where id in (?)"
                    row = await query(sql, [data.map(val => {
                        return val.item_id
                    })]);
                    data = data.map(val => {
                        row.forEach(m => {
                            if (val.item_id == m.id) {
                                val.name = m.name
                                val.url = m.url
                                val.describe = m.describe
                            }
                        })
                        return val
                    })
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
                action: "get_order",
            }, res);
    }
}

module.exports = SHOPGetOrder;
