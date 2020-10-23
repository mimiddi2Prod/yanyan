// var tools = require("./tool");
var db = require("./../utils/dba");

function shopGetBrand() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['last_id'] >= 0) {
                sql = "select count(id) from brand where state = ?";
                row = await db.Query(sql, param['state']);
                data.number = row[0]['count(id)']

                sql = "select id,name,image,price,sort,`desc`,create_time,state,url from brand where state = ? order by sort limit ?,?"
                row = await db.Query(sql, [param['state'], param['last_id'] * 4, 4])
                if (row.length > 0) {
                    data.brandList = row
                }
            } else {
                // sql = "select id,name from brand where state = ?"
                sql = "select id,name from brand"
                row = await db.Query(sql)
                if (row.length > 0) {
                    data = row
                }
            }


            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetBrand;