var tools = require("./../tool");
var formatTime = require('./../utils/formatTime')

async function YLYPrintOrder(tradeId) {
    var tool = new tools;
    var query = tool.query
    var data = {};
    let row = [], sql = ""

    sql = 'select * from `order` where tradeId = ?'
    row = await query(sql, tradeId);

    data.order = row
    data.create_time = formatTime(new Date(row[0].update_time))
    data.address_text = row[0].address_text
    data.receiver = row[0].receiver
    data.tel = row[0].tel
    data.trade_id = tradeId
    data.pay_state = row[0].pay_state == 0 ? '微信支付' : '积分支付'
    data.postage = row[0].postage

    let select_card_id = row[0].select_card_id
    if (select_card_id) {
        sql = "select cash from card_info where card_id = (select card_id from card where id = ?)"
        row = await query(sql, select_card_id)
        data.reduce_cost = JSON.parse(row[0].cash).reduce_cost
    }

    let yly = require("../utils/yly")
    let y = yly.ToPrint(data, 'mach111', 'orderid')

    return {text: 'success'}
}

module.exports = YLYPrintOrder;

// function getAverageDisCountPrice(data) {
//     console.info(data)
//     let order = data.order
//     let reduce_cost = order[0].reduce_cost
//     let temp = null
//     // 价格高到低
//     for (let i = 0; i < order.length - 1; i++) {
//         for (let j = 0; j < order.length - 1 - i; j++) {
//             if (Number(order[j].single_price) < Number(order[j + 1].single_price)) {
//                 temp = order[j]
//                 order[j] = order[j + 1]
//                 order[j + 1] = temp
//             }
//         }
//     }
//
//     let orderNumber = 0
//     for (let i = 0; i < order.length; i++) {
//         orderNumber += order[i].number
//     }
//
//     let cost = 0, emaining = reduce_cost, reduceNumber = 0
//     for (let i = 0; i < order.length; i++) {
//         // 优惠向上取整
//         if (i == order.length - 1) {
//             order[i].disCountPrice = Number(order[i].single_price) - (emaining / (orderNumber - reduceNumber))
//         }
//         // cost = Number((Math.round(emaining / (order.length - i) * 100) / 100).toFixed(2))
//         cost = Number((Math.round(emaining / (orderNumber - reduceNumber) * 100) / 100).toFixed(2))
//         emaining = (emaining - cost).toFixed(2)
//         order[i].disCountPrice = Number(order[i].single_price) - cost
//
//         reduceNumber += order[i].number
//     }
//     data.order = order
//     return data
// }