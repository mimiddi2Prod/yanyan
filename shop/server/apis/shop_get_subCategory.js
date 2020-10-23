var tools = require("./../tool");

function SHOPGetSubCategory() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetSubCategory::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [];
        try {
            row = await query("select name,image,url,id,parent_id from category where home_nav = 0 ORDER BY sort");
            data = row.length == 0 ? [] : row
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
                action: "get_subCategory",
            }, res);
    }
}

module.exports = SHOPGetSubCategory;
