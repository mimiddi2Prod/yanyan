var db = require("./../utils/dba");

function shopGetNavigation() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // 总量
            sql = "select count(id) from category where `type` = ? and home_nav = ?";
            // row = await db.Query(sql, [1, param['home_nav']]);
            row = await db.Query(sql, [0, param['home_nav']]); // 换成大分类导航
            data.number = row[0]['count(id)']
            // list
            sql = "select id,name,image,url,create_time,sort,home_nav from category where `type` = ? and home_nav = ? order by sort limit ?,?"
            // row = await db.Query(sql, [1, param['home_nav'], param['last_id'] * 5, 5])
            row = await db.Query(sql, [0, param['home_nav'], param['last_id'] * 5, 5])
            if (row.length > 0) {
                data.goryList = row
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

module.exports = shopGetNavigation;