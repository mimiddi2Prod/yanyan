var tools = require("./../tool");

const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser()

var http = require("http")

function ShopWxPayNotify() {
    var tool = new tools;
    var query = tool.query;

    this.run = async function (xml) {
        var sql = '', row = ''
        // console.info('获得支付结果回调')
        // console.info(xml)

        // 修改订单支付状态
        var e = await xmlParse(xml)
        if (e.xml.return_code[0] === 'SUCCESS' && e.xml.result_code[0] === 'SUCCESS') {
            let tradeId = e.xml.out_trade_no[0]
            let openid = e.xml.openid[0]
            let totalPrice = Number(e.xml.total_fee[0]) * 0.01 // 获取的值 1 = 0.01

            // 查询对应订单
            sql = 'select * from `order` where tradeId = ? and open_id = ?'
            row = await query(sql, [tradeId, openid])

            if (row.length > 0) {
                let rowData = row

                if (rowData[0].state == 0) {
                    //计算积分
                    let integral = 0
                    for (let i in rowData) {
                        integral += Number(rowData[i].single_price) * Number(rowData[i].number)
                    }
                    let reduce_cost = 0
                    if (rowData[0].select_card_id) {
                        sql = "select card_id from card where id = ?"
                        row = await query(sql, rowData[0].select_card_id)

                        sql = "select cash from card_info where card_id = ?"
                        row = await query(sql, row[0].card_id)
                        reduce_cost = JSON.parse(row[0].cash).reduce_cost / 100
                    }
                    integral = integral - reduce_cost
                    integral = Number((integral * 0.05).toFixed(2))
                    sql = "select integral from `user` where open_id = ?"
                    row = await tool.query(sql, openid)
                    let currentIntegral = row[0].integral
                    currentIntegral = Number(currentIntegral) + integral
                    sql = "update `user` set integral = ? where open_id = ?"
                    row = await tool.query(sql, [currentIntegral, openid])
                    //计算积分

                    // 取消待支付后
                    sql = 'update `order` set state = ?,pay_state = ? where tradeId = ? and open_id = ?'
                    row = await query(sql, [2, 0, tradeId, openid])

                    // 已支付
                    sql = "update paid set state = ? where order_id in(?)"
                    row = await tool.query(sql, [1, rowData.map(function (eData) {
                        return eData.id
                    })])

                    let YLYPrintOrder = require('./yly_print_order')
                    let callback = await YLYPrintOrder(tradeId)

                    // 如果有使用优惠券，就进行核销
                    let select_card_id = rowData[0].select_card_id
                    sql = "update card set trade_id = ? where id = ?"
                    row = await tool.query(sql, [tradeId, select_card_id])

                    sql = "select * from card where id = ?"
                    row = await tool.query(sql, select_card_id)

                    var postDataJson = JSON.stringify({
                        card_id: row[0].card_id,
                        encrypt_code: row[0].code
                    })
                    var options = {
                        host: '127.0.0.1',
                        port: '9900',
                        path: '/apis/consumeCard',
                        method: 'POST',
                        form: postDataJson,
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                    }

                    async function Call() {
                        let e = await HttpPost(options, postDataJson)
                        e = JSON.parse(e)
                    }

                    await Call()
                }

            }
        }
    }


}

module.exports = ShopWxPayNotify;

async function xmlParse(xml) {
    return new Promise(function (resolve, reject) {
        xmlParser.parseString(xml, (err, success) => {
            if (err) {
                log('parser xml error ', err)
                reject(err)
            } else {
                resolve(success)
            }
        })
    })
}

async function HttpPost(option, postData) {
    return new Promise(function (resolve, reject) {
        var req = http.request(option, function (res) {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            })
            res.on('end', function (e) {
                resolve(data)
            })
        })
        req.write(postData);
        req.end();
    })
}
