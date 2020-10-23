var db = require("./../utils/dba");
var refund = require("./wxRefund");

function shopRefund() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var data = {}
        var row = []
        var sql = ""
        try {
            var payData = {}
            // var money = param['money']
            // var openid = param['openid']
            var refund_fee = param['refund_fee']
            var tradeId = param['tradeId']   // 商户订单号
            var order_id = param['order_id']
            var after_sale_state = param['after_sale_state']

            sql = "select user_id,single_price,`number`,postage,discount_price,pay_state,discount_price_total from `order` where tradeid = ?"
            row = await db.Query(sql, tradeId)
            let pay_state = row[0].pay_state
            // let cuid = row[0].customer_uid // 微信退款使用
            var user_id = row[0].user_id
            var total_fee = 0
            for (let i in row) {
                // total_fee = total_fee + Number(row[i].single_price) * Number(row[i].number)
                if (row[i].discount_price) {
                    // total_fee = (Number(total_fee) + Number((Number(row[i].discount_price) * Number(row[i].number)).toFixed(2))).toFixed(2)
                    total_fee = (Number(total_fee) + row[i].discount_price_total).toFixed(2)
                } else {
                    total_fee = (Number(total_fee) + Number((Number(row[i].single_price) * Number(row[i].number)).toFixed(2))).toFixed(2)
                }

            }
            if (row[0].postage) {
                total_fee = (Number(total_fee) + Number(row[0].postage)).toFixed(2)
            }
            refund_fee = Number(Number(refund_fee).toFixed(2))
            total_fee = Number(Number(total_fee).toFixed(2))
            console.info(total_fee)
            // 总金额需要查相同订单号的金额合计 tradeId
            // var total_fee = param['total_fee']

            payData.refund_fee = Number((refund_fee * 100).toFixed(2))
            payData.tradeId = tradeId
            payData.total_fee = Number((total_fee * 100).toFixed(2))

            // 优惠券


            if (payData.tradeId.indexOf('y') == -1 && pay_state == 0) {
                // 微信支付退款
                async function Call() {
                    var e = await refund(payData)
                    data.code = -1
                    if (e == '订单已全额退款' || e.indexOf('已部份退款') != -1) {
                        data.code = 0
                        after_sale_state = after_sale_state + 3
                        sql = "update `order` set after_sale_state = ? where id = ?"
                        row = await db.Query(sql, [after_sale_state, order_id])
                        // 可能需要做一个数据验证，确保部份退款的情况下，确实修改了状态（全款退款，反正钱退完了再退管理后台会报错）
                        // todo 积分减法
                        // 更新会员信息
                        // let updateCustomer = require('./yinbao_update_customer')
                        // let paramData = {
                        //     balanceIncrement: 0,
                        //     pointIncrement: refund_fee,
                        //     customerUid: cuid
                        // }
                        // let callData = await updateCustomer(paramData)

                        // 微信支付会产生 5%的积分增值，退款必须扣掉
                        sql = "select integral from `user` where id = ?"
                        row = await db.Query(sql, user_id)
                        let integral = Math.round((row[0].integral - (Number(refund_fee) * 0.05)) * 100) / 100
                        sql = "update `user` set integral = ? where id = ?"
                        row = await db.Query(sql, [integral, user_id])
                    } else {
                        data.code = 1
                    }
                    data.text = e
                }

                await Call()
            } else {
                sql = "select integral from `user` where id = ?"
                row = await db.Query(sql, user_id)
                let integral = row[0].integral + Number(refund_fee)
                sql = "update `user` set integral = ? where id = ?"
                row = await db.Query(sql, [integral, user_id])

                sql = "select * from `order` where id = ?";
                row = await db.Query(sql, order_id)
                let after_sale_state = row[0].after_sale_state
                sql = "update `order` set after_sale_state = ? where id = ?";
                row = await db.Query(sql, [after_sale_state + 3, order_id]);

                data.code = 0
                data.text = "退款成功"
            }
            // else {
            //     // 银豹支付退款
            //     sql = "select customerUid from `user` where id = ?"
            //     row = await db.Query(sql, user_id)
            //
            //     // 更新会员信息
            //     let updateCustomer = require('./yinbao_update_customer')
            //     let paramData = {
            //         balanceIncrement: refund_fee,
            //         pointIncrement: refund_fee,
            //         customerUid: row[0].customerUid
            //     }
            //     let callData = await updateCustomer(paramData)
            //     console.info(callData)
            //     if (callData.code == 0) {
            //         data = callData
            //         after_sale_state = after_sale_state + 3
            //         sql = "update `order` set after_sale_state = ? where id = ?"
            //         row = await db.Query(sql, [after_sale_state, order_id])
            //     }
            // }


            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }

    }
}

module.exports = shopRefund;