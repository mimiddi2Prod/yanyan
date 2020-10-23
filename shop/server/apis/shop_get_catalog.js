var tools = require("./../tool");

function SHOPGetCategory() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetCategory::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [];
        try {
            let catalogTop = await query("select * from category where `type` = 0 order by sort"),
                subCategory = await query("select * from category where `type` != 0 order by sort")

            catalogTop = catalogTop.map(val => {
                val.subCategory = []
                subCategory.forEach(m => {
                    if (val.id == m.parent_id) {
                        val.subCategory.push(m)
                    }
                })
                return val
            })
            data = catalogTop
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
                action: "get_catelog",
            }, res);
    }
}

module.exports = SHOPGetCategory;
