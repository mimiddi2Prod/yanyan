var tools = require("./../tool");

function SHOPGetAd() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetAd::Run";
        var data = [];
        var response = tool.error.OK;
        var row = [];
        try {
            var sql = "select `type`,url,image,text from advertisement where state = 0 and type in (?,?) ORDER BY sort";
            row = await query(sql, ['0', '2']);
            data.push({
                type: "opening",
                data: row.length == 0 ? [] : row
            })
            sql = "select `type`,url,image,text from advertisement where state = 0 and type = ? ORDER BY sort";
            row = await query(sql, 1);
            data.push({
                type: "banner",
                data: row.length == 0 ? [] : row
            })
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
                action: "get_ad",
            }, res);
    }
}

module.exports = SHOPGetAd;
