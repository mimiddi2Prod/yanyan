var db = require("./../utils/dba");

function shopGetDeliveryOrder() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // 待发货
            // sql = "select sum(total_price) as total_price,sum(`number`) as number,sum(integral_price) as integral_price,update_time,create_time,state,postage,tradeId,after_sale_state,integral_price,select_card_id,address_text,tel,receiver from `order` where state = ? and after_sale_state < ? group by tradeId order by create_time desc";
            // row = await db.Query(sql, [2, 4]);
            sql = "select sum(total_price) as total_price,sum(`number`) as number,sum(integral_price) as integral_price,update_time,create_time,state,postage,tradeId,after_sale_state,integral_price,select_card_id,address_text,tel,receiver from `order` where state = ? group by tradeId order by create_time desc";
            row = await db.Query(sql, [2]);
            data.order = row
            if (data.order.length > 0) {
                for (let i in data.order) {
                    sql = "select id,image,goodsname,item_id,single_price,`number`,after_sale_state from `order` where tradeId = ?"
                    row = await db.Query(sql, data.order[i].tradeId);
                    data.order[i].goodsList = row

                    for (let j in data.order[i].goodsList) {
                        sql = "select * from `aftersale` where order_id = ?"
                        row = await db.Query(sql, data.order[i].goodsList[j].id);
                        if (row.length > 0) {
                            data.order[i].goodsList[j].isAfterSale = true
                            data.order[i].goodsList[j].alterSaleNumber = row[0].number
                        }
                    }
                    for (let k = data.order[i].goodsList.length - 1; k >= 0; k--) {
                        if (data.order[i].goodsList[k].alterSaleNumber == data.order[i].goodsList[k].number) {
                            data.order[i].goodsList.splice(k, 1)
                        }
                    }
                    let isAfterSale = data.order[i].goodsList.every(function (value) {
                        return value.isAfterSale && value.alterSaleNumber == value.number
                    })
                    isAfterSale ? data.order[i].del = true : ""
                }
                for (let y = data.order.length - 1; y >= 0; y--) {
                    if (data.order[y].del) {
                        data.order.splice(y, 1)
                    }
                }
            }


            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetDeliveryOrder;