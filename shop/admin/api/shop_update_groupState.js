var db = require("./../utils/dba");

function shopUpdateGroupState() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "update group_buy set founded = ? where item_id = ?";
            row = await db.Query(sql, [param['founded'], param['id']]);
            console.info(row)
            if (row.changedRows == 1) {
                if(param['founded'] == -1){
                    sql = "update `order` set after_sale_state = ? where item_id = ?";
                    row = await db.Query(sql, [1, param['id']]);
                }
                data.text = '更新团购状态成功'
            } else {
                data.text = '更新团购状态成功'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateGroupState;