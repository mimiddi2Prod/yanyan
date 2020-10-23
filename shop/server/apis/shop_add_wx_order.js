var tools = require("./../tool");

async function SHOPAddWXOrder(getParam) {
    var tool = new tools;
    var data = {};
    let row = [], sql = ""

    let flag = 0

    if (getParam.order[0].select_card_id) {
        getParam = getAverageDisCountPrice(getParam)
    }

    for (let i in getParam.order) {
        let param = getParam.order[i]
        let sumPrice = Number(param["single_price"]) * Number(param["number"])
        if (param["disCountPrice"]) {
            sql = "insert into `order`(user_id,open_id,item_id,goodsname,image,`number`,state,address_text,tel,receiver,single_price,total_price,postage,tradeId,have_cost_integral,integral_price,create_time,update_time,select_card_id,discount_price,discount_price_total,note)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?,?,?,?)"
            row = await tool.query(sql, [param["user_id"], param["open_id"], param["item_id"], param["name"], param["image"], param["number"], param["state"], param["address_text"], param["tel"], param["receiver"], param["single_price"], sumPrice, param["postage"], getParam["tradeId"], param["have_cost_integral"], param["integral_price"], param["select_card_id"], param["disCountPrice"], param["disCountPriceTotal"], param["note"]])
        } else {
            sql = "insert into `order`(user_id,open_id,item_id,goodsname,image,`number`,state,address_text,tel,receiver,single_price,total_price,postage,tradeId,have_cost_integral,integral_price,create_time,update_time,select_card_id,note)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?,?)"
            row = await tool.query(sql, [param["user_id"], param["open_id"], param["item_id"], param["name"], param["image"], param["number"], param["state"], param["address_text"], param["tel"], param["receiver"], param["single_price"], sumPrice, param["postage"], getParam["tradeId"], param["have_cost_integral"], param["integral_price"], param["select_card_id"], param["note"]])
        }

        if (row.insertId) {
            let order_id = row.insertId
            data.text = "添加订单成功"
            flag++
            sql = "insert into paid(user_id,item_id,`number`,state,order_id,create_time)values(?,?,?,?,?,CURRENT_TIMESTAMP)"
            row = await tool.query(sql, [param["user_id"], param["item_id"], param["number"], param["state"], order_id])

            sql = "delete from cart where user_id = ? and item_id = ?"
            row = await tool.query(sql, [param['user_id'], param["item_id"]])
        }
    }

    if (flag == getParam.length) {
        data.addOrderStatus = 0
    }

    return data
}

module.exports = SHOPAddWXOrder;

function getAverageDisCountPrice(data) {
    let order = data.order
    let total_price = 0
    for (let i in order) {
        order[i].single_price = Number(order[i].single_price)
        total_price = (Number(total_price) + (order[i].single_price * order[i].number)).toFixed(2)
    }
    total_price = Number(total_price)

    let reduce_cost = order[0].reduce_cost
    let temp = null
    // 价格高到低
    for (let i = 0; i < order.length - 1; i++) {
        for (let j = 0; j < order.length - 1 - i; j++) {
            if (Number(order[j].single_price) < Number(order[j + 1].single_price)) {
                temp = order[j]
                order[j] = order[j + 1]
                order[j + 1] = temp
            }
        }
    }

    let cost = 0,
        // 计算单样物品折扣后，剩余折扣价格
        emaining = reduce_cost,
        //保留两位小数，四舍五入
        avg = Math.round((reduce_cost / total_price) * 100) / 100
    for (let i = 0; i < order.length; i++) {
        // 最后一项
        if (i == order.length - 1) {
            order[i].disCountPrice = Number((order[i].single_price - (emaining / order[i].number)).toFixed(2))
            order[i].disCountPriceTotal = Number((order[i].single_price * order[i].number - emaining).toFixed(2))
            break
        }
        // 前n - 1项
        cost = Number((avg * order[i].single_price).toFixed(2))
        emaining = Number((emaining - (cost * order[i].number)).toFixed(2))
        order[i].disCountPrice = Number((order[i].single_price - cost).toFixed(2))
        order[i].disCountPriceTotal = Number((order[i].disCountPrice * order[i].number).toFixed(2))
    }
    data.order = order
    return data
}
