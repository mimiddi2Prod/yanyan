var db = require("./../utils/dba");

function shopUpdateNavigation() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (!param['home_nav'].toString()) {
                console.info('home_nav没有获取到')
            } else if (!param['id']) {
                console.info('id没有获取到')
            } else {
                sql = "update category set home_nav = ? where id = ?"
                row = await db.Query(sql, [param['home_nav'], param['id']])
                if (row.changedRows == 1) {
                    data.text = '更改成功'
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
        //    connection.query('SELECT * FROM `order`',function (err, result) {
        //     if(err){
        //       console.log('[SELECT ERROR] - ',err.message);
        //       return;
        //     } else if(!result.length){
        //       console.info('查询失败')
        //       return callback(1);
        //     }
        //
        //    console.log('查询成功');
        //  console.info(result)
        //    return callback(result);
        // });
    }
}

module.exports = shopUpdateNavigation;