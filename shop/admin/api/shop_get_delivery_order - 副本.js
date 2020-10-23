var db = require("./../utils/dba");

function shopGetDeliveryOrder() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // 待发货
            sql = "select sum(total_price) as total_price,sum(`number`) as number,sum(integral_price) as integral_price,update_time,create_time,state,postage,tradeId,after_sale_state,integral_price,select_card_id,address_text,tel,receiver from `order` where state = ? and after_sale_state < ? group by tradeId order by create_time desc";
            row = await db.Query(sql, [2, 4]);
            data.order = row
            if (data.order.length > 0) {
                for (let i in data.order) {
                    sql = "select image,goodsname,item_id,single_price,`number` from `order` where tradeId = ?"
                    row = await db.Query(sql, data.order[i].tradeId);
                    data.order[i].goodsList = row
                }
            }


            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetDeliveryOrder;