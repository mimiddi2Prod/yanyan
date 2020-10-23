var tools = require("./../tool");

function SHOPGetOrderGroupTradeId() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetOrderGroupTradeId::Run";
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
                    sql = "select sum(total_price) as total_price,sum(`number`) as number,sum(integral_price) as integral_price,update_time,create_time,state,postage,tradeId,after_sale_state,integral_price,select_card_id,address_text,tel,receiver from `order` where user_id = ? and state != ? group by tradeId ORDER BY update_time desc limit ?,?";
                    row = await query(sql, [param['user_id'], 5, param['last_id'] * 10, 10]);
                } else {
                    // 单个拉取
                    var currentTime = new Date().getTime()
                    var oneHours = 60 * 60 * 1000
                    var time = new Date(currentTime - oneHours)
                    if (param['state'] == 0) {
                        // 客户端待付款栏 只展示一个小时内未付款 全部拉取才展示所有
                        sql = "select sum(total_price) as total_price,sum(`number`) as number,sum(integral_price) as integral_price,update_time,create_time,state,postage,tradeId,after_sale_state,integral_price,select_card_id,address_text,tel,receiver from `order` where user_id = ? and state = ? and create_time > ?  group by tradeId ORDER BY update_time desc limit ?,?";
                        row = await query(sql, [param['user_id'], param['state'], time, param['last_id'] * 10, 10]);
                    } else {
                        // 已付款(待发货) 已发货(待收货) 已收货(物流送达七天||买家确认收货)
                        // 物流送达如无法自动更改 需再做个时间判断
                        sql = "select sum(total_price) as total_price,sum(`number`) as number,sum(integral_price) as integral_price,update_time,create_time,state,postage,tradeId,after_sale_state,integral_price,select_card_id,address_text,tel,receiver from `order` where user_id = ? and state = ? and after_sale_state < ?  group by tradeId ORDER BY update_time desc limit ?,?";
                        row = await query(sql, [param['user_id'], param['state'], 4, param['last_id'] * 10, 10]);
                    }
                }
                var rowData = row
                if (rowData.length > 0) {
                    data = rowData
                    // for (let i in data) {
                    //     sql = "select image,goodsname,item_id,single_price,`number` from `order` where tradeId = ?"
                    //     row = await query(sql, data[i].tradeId);
                    //     data[i].goodsList = row
                    //
                    //     if (data[i].select_card_id) {
                    //         sql = "select * from card where id = ?"
                    //         row = await query(sql, data[i].select_card_id)
                    //         if (row.length) {
                    //             let card = row[0]
                    //
                    //             sql = "select * from card_info where card_id = ?"
                    //             row = await query(sql, card.card_id)
                    //             card.info = row[0]
                    //             data[i].card = card
                    //         } else {
                    //             data[i].select_card_id = null
                    //         }
                    //     }
                    // }
                    // 历史订单优惠券信息
                    sql = "select * from card where id in (?)"
                    let card = await query(sql, [data.map(val => {
                        return val.select_card_id
                    })]);
                    if (card.length) {
                        sql = "select * from card_info where card_id in (?)"
                        let card_info = await query(sql, [card.map(val => {
                            return val.card_id
                        })])
                        card = card.map(val => {
                            card_info.forEach(m => {
                                if (val.card_id == m.card_id) {
                                    val.info = m
                                }
                            })
                            return val
                        })
                    }

                    sql = "select image,goodsname,item_id,single_price,`number`,tradeId from `order` where tradeId in (?)"
                    let goodsList = await query(sql, [data.map(val => {
                        return val.tradeId
                    })]);

                    data = data.map(val => {
                        val.goodsList = []
                        goodsList.forEach(m => {
                            if (val.tradeId == m.tradeId) {
                                val.goodsList.push(m)
                            }
                        })
                        card.forEach(n => {
                            if (card.length && val.select_card_id == n.id) {
                                val.card = n
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

module.exports = SHOPGetOrderGroupTradeId;
