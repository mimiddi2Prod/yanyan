var tools = require("./../tool");

function SHOPPayfeeContinue() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPPayfeeContinue::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["openid"]) {
            tool.log.warn(name, 'openid is not defined')
        } else if (!param["money"]) {
            tool.log.warn(name, 'money! money! money! is not defined')
        } else if (param["money"]) {
            try {
                var payData = {}
                var money = Number(param['money'])
                var openid = param['openid']

                payData.openid = openid
                payData.body = '岩岩到家'
                payData.total_fee = Number(money * 100).toFixed(0)

                var payfee = require("./../utils/wxpay");

                async function Call() {
                    var e = await payfee(payData)
                    data = e

                    // 重新支付订单
                    var updateOrder = require('./shop_update_wx_orderState')
                    let order = {}
                    order.old_trade_id = param['order'].tradeId
                    order.trade_id = e.tradeId
                    order.state = 0
                    let callback = await updateOrder(order)
                    data.updateOrderStatus = callback
                }

                await Call()
            } catch (err) {
                tool.log.warn(name, "payfee is boom", err);
            }
        } else {
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "payfee",
            }, res);
    }
}

module.exports = SHOPPayfeeContinue;
