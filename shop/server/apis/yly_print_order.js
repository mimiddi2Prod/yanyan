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
    data.note = row[0].note

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
