var tools = require("./../tool");

function SHOPGetBrand() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetBrand::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [];
        try {
            row = await query("select name,image,url,id,`desc` from brand where state = ? ORDER BY sort limit 4", 0);
            data = row.length == 0 ? data : row
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
                action: "get_brand",
            }, res);
    }
}

module.exports = SHOPGetBrand;
