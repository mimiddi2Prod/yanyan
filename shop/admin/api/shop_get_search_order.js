var db = require("./../utils/dba");

function shopGetSearchOrder() {
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
                sql = "select count(id) from `order`";
                row = await db.Query(sql);
                data.number = row[0]['count(id)']
                // 全部拉取
                sql = "select item_id,param_id_1,param_id_2,param_1,param_2,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state from `order`  ORDER BY update_time desc limit ?,?";
                console.info(sql)
                row = await db.Query(sql, [param['last_id'] * 5, 5]);
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
                        sql = "select count(id) from `order` where state = ? and create_time > ?";
                        row = await db.Query(sql, [param['state'], time]);
                        data.number = row[0]['count(id)']
                        // 客户端待付款栏 只展示一个小时内未付款 全部拉取才展示所有
                        sql = "select item_id,param_id_1,param_id_2,param_1,param_2,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state from `order` where  state = ? and create_time > ? ORDER BY update_time desc limit ?,?";
                        row = await db.Query(sql, [param['state'], time, param['last_id'] * 5, 5]);
                    } else if (state == 4) {
                        // 已完成订单 包括已收货，以评价
                        sql = "select count(id) from `order` where state in (?,?) and after_sale_state = ?";
                        row = await db.Query(sql, [3, 4, 0]);
                        data.number = row[0]['count(id)']
                        sql = "select item_id,param_id_1,param_id_2,param_1,param_2,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state from `order` where  state in (?,?) and after_sale_state = ? ORDER BY update_time desc limit ?,?";
                        row = await db.Query(sql, [3, 4, 0, param['last_id'] * 5, 5]);
                    } else {
                        sql = "select count(id) from `order` where state = ? and after_sale_state = ?";
                        row = await db.Query(sql, [param['state'], 0]);
                        data.number = row[0]['count(id)']
                        // 已付款(待发货) 已发货(待收货) 已收货(物流送达七天||买家确认收货)
                        // 物流送达如无法自动更改 需再做个时间判断
                        sql = "select item_id,param_id_1,param_id_2,param_1,param_2,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state from `order` where state = ? and after_sale_state = ? ORDER BY update_time desc limit ?,?";
                        row = await db.Query(sql, [state, 0, param['last_id'] * 5, 5]);
                    }
                } else {
                    sql = "select count(id) from `order` where after_sale_state >= ?";
                    row = await db.Query(sql, [afterSaleState]);
                    data.number = row[0]['count(id)']

                    sql = "select item_id,param_id_1,param_id_2,param_1,param_2,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state from `order` where  after_sale_state >= ? ORDER BY update_time desc limit ?,?";
                    row = await db.Query(sql, [afterSaleState, param['last_id'] * 5, 5]);
                }

            }
            var rowData = row
            if (rowData.length > 0) {
                data.list = rowData
                // console.info(rowData)
                for (var i in data.list) {
                    sql = "select `name`,url,qcl,`describe` from item where id = ?"
                    row = await db.Query(sql, data.list[i].item_id);
                    data.list[i].name = row[0].name
                    data.list[i].url = row[0].url
                    data.list[i].qcl = row[0].qcl
                    data.list[i].describe = row[0].describe
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetSearchOrder;