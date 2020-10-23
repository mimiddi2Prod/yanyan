var tools = require("./../tool");

function SHOPGetOrder() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetOrder::Run";
        log.debug("SHOPGetOrder::Run.in");
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
                    // sql = "select item_id,param_id_1,param_id_2,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id from `order` where user_id = ? and state = ? ORDER BY update_time desc limit ?,?";
                    // row = await query(sql, [param['user_id'], param['state'], param['last_id'] * 10, 10]);
                }
                var rowData = row
                if (rowData.length > 0) {
                    data = rowData
                    // console.info(rowData)
                    for (var i in data) {
                        sql = "select `name`,url,`describe` from item where id = ?"
                        row = await query(sql, data[i].item_id);
                        data[i].name = row[0].name
                        data[i].url = row[0].url
                        // data[i].qcl = row[0].qcl
                        data[i].describe = row[0].describe

                        // if (data[i].param_id_1) {
                        //     sql = "select param,image from item_param where id = ?"
                        //     row = await query(sql, data[i].param_id_1)
                        //     if (row[0].image) {
                        //         data[i].image = row[0].image
                        //     }
                        //     data[i].param_1 = row[0].param
                        // }

                        // if (data[i].param_id_2) {
                        //     sql = "select param,image from item_param where id = ?"
                        //     row = await query(sql, data[i].param_id_2)
                        //     if (row[0].image) {
                        //         data[i].image = row[0].image
                        //     }
                        //     data[i].param_2 = row[0].param
                        // }
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

        if (response.code != tool.error.OKCode) {
            log.warn(name, JSON.stringify(response));
        }

        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_order",
            }, res);
        tool.log.debug("SHOPGetOrder::Run.out");
    }
}

module.exports = SHOPGetOrder;