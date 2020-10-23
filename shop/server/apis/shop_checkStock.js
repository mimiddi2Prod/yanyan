var tools = require("./../tool");
var tool = new tools;

function checkStock() {
    tool.log.info('checkStock is start')
    var currentTime = new Date().getTime()
    setInterval(function () {
        let sql = "select item_id, sum(number), now(),create_time,state from paid where create_time >= ? GROUP BY item_id"
        let row = tool.query(sql, new Date(currentTime))
        row.then(function (paidRes) {
            if (paidRes.length > 0) {
                for (let i in paidRes) {
                    // 新订单 且 已支付
                    if (paidRes[i].state == 1) {
                        // 查找所购物品 规格 的库存
                        sql = 'select id,stock from item where id = ?'
                        row = tool.query(sql, paidRes[i].item_id)
                        row.then(function (itemPriceRes) {
                            // 库存大于等于支付订单所购数量
                            if (itemPriceRes.length > 0 && itemPriceRes[0].stock >= paidRes[i]['sum(number)']) {
                                let updateNumber = itemPriceRes[0].stock - paidRes[i]['sum(number)']
                                sql = 'update item set stock = ? where id = ?'
                                row = tool.query(sql, [updateNumber, itemPriceRes[0].id])
                            }
                        })
                    }
                }
                // 只查找 对比 这个时间点之后的数据
                currentTime = new Date(paidRes[0]['now()']).getTime()
            }
        })
    }, 10000)

    // 清楚订单超时未付款并且使用优惠券的 给予优惠券状态清除
    var cardTime = new Date().getTime()
    setInterval(function () {
        let sql = "select id,select_card_id,now(),create_time from `order` where create_time <= ? and state = ? and select_card_id is not null GROUP BY select_card_id"
        let row = tool.query(sql, [new Date(cardTime - 3600000), 0])
        row.then(function (cardRes) {
            if (cardRes.length > 0) {
                sql = "update `order` set select_card_id = ? where select_card_id in (?)"
                row = tool.query(sql,[null,cardRes.map(function (e) {
                    return e.select_card_id
                })])
                // 只查找 对比 这个时间点之后的数据
                cardTime = new Date(cardRes[0]['now()']).getTime()
            }
        })
    }, 10000)
}

module.exports = checkStock;

// 添加说明
// 只有已支付的订单才去 数据库表<item_price>减库存
// 对于下单但是未支付的情况采取锁单的方案是
// 在给客户端商品详情数据的时候 库存会对在paid中 一个小时内未付款的商品下单数量进行 减法计算
// 详情见 shop_get_price.js
