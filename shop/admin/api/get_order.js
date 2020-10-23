var db = require("./../utils/dba");

function get_order() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            console.info('start')
            console.info(param['state'])
            // 数据库需要加订单号 说明是同一个包裹
            // state -1全部拉取 0待支付 1待发货 2已发货 3退款|售后 4已完成 5已关闭
            if (param['state'] == -1) {
                sql = "select count(id),tradeId from `order` group by tradeId";
                row = await db.Query(sql);
                data.number = row.length
                // 全部拉取
                sql = "select tradeId from `order` group by tradeId ORDER BY update_time desc limit ?,?"
                row = await db.Query(sql, [param['last_id'] * 5, 5]);
                data.tradeIdList = row
                // sql = "select user_id,item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,select_card_id,discount_price from `order`  ORDER BY update_time desc limit ?,?";
                sql = "select user_id,item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,select_card_id,discount_price,note,pay_state from `order` where tradeId in (?) ORDER BY update_time desc";
                console.info(sql)
                row = await db.Query(sql, [data.tradeIdList.map((item) => {
                    return item.tradeId
                })]);
            } else {
                // 单个拉取
                var state = ''
                var afterSaleState = 0
                if (param['state'] == 0) {
                    state = 0
                } else if (param['state'] == 1) {
                    state = 1
                } else if (param['state'] == 2) {
                    state = 2
                } else if (param['state'] == 3) {
                    // 新增--》
                    state = 3
                    // 《--新增
                    afterSaleState = 1
                } else if (param['state'] == 4) {
                    state = 4
                } else if (param['state'] == 5) {
                    state = -1
                }
                var currentTime = new Date().getTime()
                var oneHours = 60 * 60 * 1000
                var time = new Date(currentTime - oneHours)
                if (afterSaleState == 0) {
                    if (state == 0) {
                        // sql = "select count(id) from `order` where state = ? and create_time > ?";
                        // row = await db.Query(sql, [param['state'], time]);
                        // data.number = row[0]['count(id)']
                        // // 客户端待付款栏 只展示一个小时内未付款 全部拉取才展示所有
                        // sql = "select user_id,item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,select_card_id,discount_price from `order` where  state = ? and create_time > ? ORDER BY update_time desc limit ?,?";
                        // row = await db.Query(sql, [param['state'], time, param['last_id'] * 5, 5]);
                        sql = "select count(id),tradeId from `order` where state = ? and create_time > ? group by tradeId";
                        row = await db.Query(sql, [param['state'], time]);
                        data.number = row.length
                        // 客户端待付款栏 只展示一个小时内未付款 全部拉取才展示所有
                        sql = "select tradeId from `order` where  state = ? and create_time > ? group by tradeId ORDER BY update_time desc limit ?,?"
                        row = await db.Query(sql, [param['state'], time, param['last_id'] * 5, 5]);
                        data.tradeIdList = row

                        sql = "select user_id,item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,select_card_id,discount_price,note from `order` where  tradeId in (?) ORDER BY update_time desc";
                        row = await db.Query(sql, [data.tradeIdList.map((item)=>{
                            return item.tradeId
                        })]);
                    } else if (state == 4) {
                        // 已完成订单 包括已收货，以评价
                        sql = "select count(id),tradeId from `order` where state in (?,?) and after_sale_state = ? group by tradeId";
                        row = await db.Query(sql, [3, 4, 0]);
                        data.number = row.length

                        sql = "select tradeId from `order` where  state in (?,?) and after_sale_state = ? group by tradeId ORDER BY update_time desc limit ?,?"
                        row = await db.Query(sql, [3, 4, 0, param['last_id'] * 5, 5]);
                        data.tradeIdList = row

                        sql = "select user_id,item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,select_card_id,discount_price,note from `order` where  tradeId in (?) ORDER BY update_time desc";
                        row = await db.Query(sql, [data.tradeIdList.map((item)=>{
                            return item.tradeId
                        })]);
                    } else {
                        sql = "select count(id),tradeId from `order` where state = ? and after_sale_state = ? group by tradeId";
                        row = await db.Query(sql, [state, 0]); // param['state'] 替换为 state
                        data.number = row.length
                        // 已付款(待发货) 已发货(待收货) 已收货(物流送达七天||买家确认收货)
                        // 物流送达如无法自动更改 需再做个时间判断
                        sql = "select tradeId from `order` where state = ? and after_sale_state = ? group by tradeId ORDER BY update_time desc limit ?,?"
                        row = await db.Query(sql, [state, 0, param['last_id'] * 5, 5]);
                        data.tradeIdList = row

                        sql = "select user_id,item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,select_card_id,discount_price,note from `order` where  tradeId in (?) ORDER BY update_time desc";
                        row = await db.Query(sql, [data.tradeIdList.map((item)=>{
                            return item.tradeId
                        })]);
                    }
                } else {
                    sql = "select count(id) from `order` where after_sale_state >= ?";
                    row = await db.Query(sql, [afterSaleState]);
                    data.number = row[0]['count(id)']

                    sql = "select user_id,item_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,select_card_id,discount_price,note from `order` where  after_sale_state >= ? ORDER BY update_time desc limit ?,?";
                    row = await db.Query(sql, [afterSaleState, param['last_id'] * 5, 5]);
                }

            }
            var rowData = row
            if (rowData.length > 0) {
                data.list = rowData
                // console.info(rowData)
                for (var i in data.list) {
                    sql = "select `name`,url,`describe` from item where id = ?"
                    row = await db.Query(sql, data.list[i].item_id);
                    data.list[i].name = row[0].name
                    data.list[i].url = row[0].url
                    // data.list[i].qcl = row[0].qcl
                    data.list[i].describe = row[0].describe

                    sql = "select count(id),tradeId from `order` where user_id = ? and state >= ? group by tradeId";
                    row = await db.Query(sql, [data.list[i].user_id, 2]);
                    if (row.length > 0 && data.list[i].tradeId == row[0].tradeId) {
                        data.list[i].isFristOrder = true
                    } else {
                        data.list[i].isFristOrder = false
                    }
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = get_order;