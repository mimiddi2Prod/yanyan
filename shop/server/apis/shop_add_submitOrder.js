var tools = require("./../tool");
var http = require("http")

function SHOPAddSubmitOrder() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPAddSubmitOrder::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["user_id"]) {
            tool.log.warn(name, 'user_id is not defined')
        } else if (param["user_id"]) {
            var row = [];
            var sql = ""
            try {
                let sumPrice = Number(param["single_price"]) * Number(param["number"])
                if (param["disCountPrice"]) {
                    sql = "insert into `order`(user_id,open_id,item_id,goodsname,image,`number`,state,address_text,tel,receiver,single_price,total_price,postage,tradeId,have_cost_integral,integral_price,create_time,update_time,select_card_id,pay_state,discount_price,discount_price_total,note)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?,?,?,?,?)"
                    row = await tool.query(sql, [param["user_id"], param["open_id"], param["item_id"], param["name"], param["image"], param["number"], param["state"], param["address_text"], param["tel"], param["receiver"], param["single_price"], sumPrice, param["postage"], param["tradeId"], param["have_cost_integral"], param["integral_price"], param["select_card_id"], param["pay_state"], param["disCountPrice"], param["disCountPriceTotal"], param["note"]])
                } else {
                    sql = "insert into `order`(user_id,open_id,item_id,goodsname,image,`number`,state,address_text,tel,receiver,single_price,total_price,postage,tradeId,have_cost_integral,integral_price,create_time,update_time,select_card_id,pay_state,note)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?,?,?)"
                    row = await tool.query(sql, [param["user_id"], param["open_id"], param["item_id"], param["name"], param["image"], param["number"], param["state"], param["address_text"], param["tel"], param["receiver"], param["single_price"], sumPrice, param["postage"], param["tradeId"], param["have_cost_integral"], param["integral_price"], param["select_card_id"], param["pay_state"], param["note"]])
                }

                if (row.insertId) {
                    var order_id = row.insertId
                    data.text = "添加订单成功"
                    if (row.length > 0) {
                        sql = "insert into paid(user_id,item_id,`number`,state,order_id,create_time)values(?,?,?,?,?,CURRENT_TIMESTAMP)"
                        row = await tool.query(sql, [param["user_id"], param["item_id"], param["number"], param["state"], order_id])
                    }

                    sql = "delete from cart where user_id = ? and item_id = ?"
                    row = await tool.query(sql, [param['user_id'], param["item_id"]])

                    if (param["select_card_id"] && param["tradeId"].indexOf('y') != -1) {
                        // 如果有使用优惠券，就进行核销
                        let select_card_id = param["select_card_id"]
                        let tradeId = param["tradeId"]
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
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPAddSubmitOrder::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else {
            // response = tool.error.ErrorUserType;
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "add_order",
            }, res);
    }
}

module.exports = SHOPAddSubmitOrder;

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
