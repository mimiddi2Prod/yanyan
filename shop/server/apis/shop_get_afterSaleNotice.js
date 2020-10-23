var tools = require("./../tool");

function SHOPGetAfterSaleNotice() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetAfterSaleNotice::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [];
        var sql = ''
        if (!param['user_id']) {
            tool.log.warn(name, 'user_id is not defined')
        } else if (param['user_id']) {
            try {
                sql = "select * from after_sale_notice where user_id = ?";
                row = await query(sql, param['user_id']);
                if (row.length > 0) {
                    data.code = 0
                    data.text = "有拒绝通知"

                    sql = "delete from after_sale_notice where user_id = ?"
                    row = await query(sql, param['user_id'])
                } else {
                    data.code = 1
                    data.text = "无事发生"
                }
            } catch (err) {
                if (err.code) {
                    response = tool.error.ErrorSQL;
                    log.warn(name, "code:", err.code, ", sql:", err.sql);
                } else {
                    log.warn(name, JSON.stringify(response));
                    response = tool.error.ErrorCatch;
                }
            }
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_afterSaleNotice",
            }, res);
    }
}

module.exports = SHOPGetAfterSaleNotice;
