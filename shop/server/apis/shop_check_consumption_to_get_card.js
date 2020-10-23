var tools = require("./../tool");

function SHOPCheckConsumptionToGetCard() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPCheckConsumptionToGetCard::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["openid"]) {
            tool.log.warn(name, 'op_id is not defined')
        } else {
            var row = [];
            var sql = ""
            try {
                sql = "select * from card_info where `type` = ?"
                row = await tool.query(sql, 'consumption')
                if (row.length) {
                    data.haveConsumptionCard = true
                } else {
                    data.haveConsumptionCard = false
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPCheckConsumptionToGetCard::Run", "code:", err.code, ", sql:", err.sql);
            }
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "check_consumption_to_get_card",
            }, res);
    }
}

module.exports = SHOPCheckConsumptionToGetCard;
