var tools = require("./../tool");

function SHOPPayfee() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPPayfee::Run";
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

                    var addOrder = require('./shop_add_wx_order')
                    let order = {}
                    order.order = param['order']
                    order.tradeId = e.tradeId
                    let callback = await addOrder(order)
                    data.addOrderStatus = callback
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

module.exports = SHOPPayfee;
