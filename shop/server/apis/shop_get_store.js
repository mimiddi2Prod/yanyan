var tools = require("./../tool");
var qqMapSubkey = require("./../config/wxConfig").qqMapSubkey

function SHOPGetStore() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetStore::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [];
        try {
            var sql = "select * from store";
            row = await query(sql);
            data.store = row
            data.qqMapSubkey = qqMapSubkey
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
                action: "get_store",
            }, res);
    }
}

module.exports = SHOPGetStore;
