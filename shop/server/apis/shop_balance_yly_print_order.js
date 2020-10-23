var tools = require("./../tool");

function SHOPBalanceYLYPrintOrder() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPBalanceYLYPrintOrder::Run";
        var data = {};
        var response = tool.error.OK;
        var sql = '', row = [];
        try {
            let YLYPrintOrder = require('./yly_print_order')
            let callback = await YLYPrintOrder(param['tradeId'])
            data = callback
        } catch (err) {
            if (err.code) {
                response = tool.error.ErrorSQL;
                log.warn(name, "code:", err.code, ", sql:", err.sql);
            } else {
                log.warn(name, JSON.stringify(response));
                response = tool.error.ErrorCatch;
            }
        }

        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "balance_yly_print_order",
            }, res);
    }
}

module.exports = SHOPBalanceYLYPrintOrder;
