var tools = require("./../tool");

const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser()

var http = require("http")

function ShopWxRefundNotify() {
    var tool = new tools;
    // var log = tool.log;
    var query = tool.query;

    this.run = async function (xml) {
        var sql = '', row = ''
        console.info('获得退款结果回调')
        console.info(xml)

        // 修改订单支付状态
        var e = await xmlParse(xml)
        if (e.xml.return_code[0] === 'SUCCESS' && e.xml.result_code[0] === 'SUCCESS') {
            let tradeId = e.xml.out_trade_no[0]
            let openid = e.xml.openid[0]
            // let total_fee = e.xml.total_fee[0]
            let totalPrice = Number(e.xml.total_fee[0]) * 0.01 // 获取的值 1 = 0.01

            // 查询对应订单
            sql = 'select * from `order` where tradeId = ? and open_id = ?'
            row = await query(sql, [tradeId, openid])
            // console.info(row)

            if (row.length > 0) {
                let rowData = row
                if (rowData[0].state == 0) {
                    // 更改支付状态
                    sql = 'update `order` set state = ? where tradeId = ? and open_id = ?'
                    row = await query(sql, [1, tradeId, openid])

                    // 已支付
                    sql = "update paid set state = ? where order_id in(?)"
                    // row = await tool.query(sql, [1, param["order_id"]])
                    row = await tool.query(sql, [1, rowData.map(function (eData) {
                        return eData.id
                    })])

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
                        console.info(e)
                        // if (e.code == 0) {
                        //     data.cardList = e.data
                        // }
                    }

                    await Call()
                }

            }
        }
    }


}

module.exports = ShopWxRefundNotify;

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
            // res.headers = {
            //     'data-signature': sign,
            //     'Content-Type': 'application/json;charset=UTF-8'
            // }
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