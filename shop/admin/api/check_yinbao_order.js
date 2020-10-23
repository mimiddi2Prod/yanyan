var db = require("./../utils/dba");

module.exports = function getYinbaoOrder() {
    setInterval(function () {
        var sql = "select * from yinbao_update_time"
        var row = db.Query(sql)
        row.then(function (eData) {
            if (eData.length > 0) {
                let start_time = eData[0]['last_update_time']
                let timeList = {}, current_time = new Date()
                timeList.start_time = new Date(start_time)
                timeList.end_time = new Date(new Date(start_time).getTime() + (24 * 60 * 60 * 1000))

                if (timeList.end_time < current_time) {
                    getOrder(timeList)
                }
            }
        })
    }, 10 * 1000)
}

function getOrder(data) {
    let sql = '', row = ''
    let getTicket = require('./yinbao_get_ticket')
    let callData = getTicket(data)
    callData.then(function (eData2) {
        console.info(eData2)
        if (eData2.status == 'success' && eData2.data.result.length > 0) {
            let result = eData2.data.result
            // console.info(result)
            let day_sellprice = 0
            for (let i in result) {
                sql = 'insert into yinbao_order (cashier,cashierUid,customerUid,datetime,invalid,items,orderNo,payments,remark,rounding,serviceFee,sn,ticketType,totalAmount,totalProfit,uid,webOrderNo)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
                row = db.Query(sql, [result[i].cashier, result[i].cashierUid, result[i].customerUid, result[i].datetime, result[i].invalid, result[i].items, (result[i].orderNo ? result[i].orderNo : ''), result[i].payments, (result[i].remark ? result[i].remark : ''), result[i].rounding, (result[i].serviceFee >= 0 ? result[i].serviceFee : ''), result[i].sn, result[i].ticketType, result[i].totalAmount, result[i].totalProfit, result[i].uid, result[i].webOrderNo])

                if (result[i].invalid == 0) {
                    let payments = JSON.parse(result[i].payments)
                    day_sellprice = day_sellprice + payments[0].amount
                }

            }
            // sql = "select * from yinbao_order_sellprice where start_time = ? and end_time = ?"
            // row = db.Query(sql, [data.start_time, data.end_time)])
            // console.info(data.start_time)
            // console.info(data.end_time)
            // if (row.length > 0) {
            //     let sellprice = row[0].total_price
            //     sellprice = sellprice + day_sellprice
            //     sql = 'update yinbao_order_sellprice set total_price = ?'
            //     row = db.Query(sql, sellprice)
            // } else {
                sql = 'insert into yinbao_order_sellprice (total_price,start_time,end_time)values(?,?,?)'
                row = db.Query(sql, [day_sellprice, data.start_time, data.end_time])
            // }

        }

        if (eData2.data.result.length == 100) {
            let temp = data
            data.postBackParameter = eData2.data.postBackParameter
            getOrder(temp)
        } else {
            sql = "update yinbao_update_time set last_update_time = ?"
            row = db.Query(sql, data.end_time)
        }

    })
}