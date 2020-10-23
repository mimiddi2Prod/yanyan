var db = require("./../utils/dba");

function yinbaoGetTodayOrder() {
    this.Service = async function (version, param, callback) {
        let sql = ""
        var data = {}
        let row = []
        try {
            sql = "delete from yinbao_order_today"
            row = await db.Query(sql)

            sql = "delete from yinbao_order_sellprice_today"
            row = await db.Query(sql)

            let paramData = {
                start_time: param['start_time'],
                end_time: param['end_time']
            }
            let re = await getOrder(paramData)
            if(re == 0){
                data.code = 0
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = yinbaoGetTodayOrder;

async function getOrder(paramData) {
    let sql = ""
    let row = []
    let getTicket = require('./yinbao_get_ticket')
    let callData = await getTicket(paramData)
    console.info(callData)
    if (callData.status == 'success' && callData.data.result.length > 0) {
        let result = callData.data.result
        // console.info(result)
        let day_sellprice = 0
        for (let i in result) {
            // console.info(result[0])
            sql = 'insert into yinbao_order_today (cashier,cashierUid,customerUid,datetime,invalid,items,orderNo,payments,remark,rounding,serviceFee,sn,ticketType,totalAmount,totalProfit,uid,webOrderNo)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
            row = await db.Query(sql, [result[i].cashier, result[i].cashierUid, result[i].customerUid, result[i].datetime, result[i].invalid, result[i].items, (result[i].orderNo ? result[i].orderNo : ''), result[i].payments, (result[i].remark ? result[i].remark : ''), result[i].rounding, (result[i].serviceFee >= 0 ? result[i].serviceFee : ''), result[i].sn, result[i].ticketType, result[i].totalAmount, result[i].totalProfit, result[i].uid, result[i].webOrderNo])

            if (result[i].invalid == 0) {
                let payments = JSON.parse(result[i].payments)
                day_sellprice = day_sellprice + payments[0].amount
            }

        }

        sql = 'insert into yinbao_order_sellprice_today (total_price,create_time)values(?,current_timestamp )'
        row = await db.Query(sql, day_sellprice)
    }
    if (callData.data.result.length == 100) {
        let temp = paramData
        paramData.postBackParameter = callData.data.postBackParameter
        let re = await getOrder(temp)
        return re
    }
    return 0
}