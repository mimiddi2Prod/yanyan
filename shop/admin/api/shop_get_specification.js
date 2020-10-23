var db = require("./../utils/dba");

function shopGetSpecification() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select id,name from specification"
            row = await db.Query(sql)
            if (row.length > 0) {
                data.specification = row
                data.paramList = []
                for (let i in data.specification) {
                    sql = "select param from specification_param where specification_id = ?"
                    row = await db.Query(sql, data.specification[i].id)
                    let temp = {
                        name: data.specification[i].name,
                        size: []
                    }
                    if (row.length > 0) {
                        let sizeList = row.map(function (res) {
                            return res.param
                        })
                        temp = {
                            name: data.specification[i].name,
                            size: sizeList
                        }
                    }
                    data.paramList.push(temp)
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetSpecification;