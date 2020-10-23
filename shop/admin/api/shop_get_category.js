// var mysql  = require('mysql');
// var connection = mysql.createConnection({
//   host     : '127.0.0.1',
//   user     : 'root',
//   password : '',
//   port: '3306',
//   database: 'js_shop',
// });
// connection.connect();
// var tools = require("./tool");
var db = require("./../utils/dba");

function shopGetCategory() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['type'] == 0 || param['type'] == 1) {
                // 获取父/子分类 添加商品
                sql = "select id,name,`type` from category where `type` = ? and parent_id = ?"
                row = await db.Query(sql, [param['type'], param['parent_id']])
                if (row.length > 0) {
                    data = row
                }else{
                    data = []
                }
            } else {
                // 分类管理
                sql = "select count(id) from category where `type` = ?";
                row = await db.Query(sql, 0);
                data.number = row[0]['count(id)']
                // 全部拉取
                if(param['last_id'] >= 0){
                    sql = "select id,name,image,url,create_time,parent_id,`type`,home_nav,sort,`describe` from category where `type` = ? ORDER BY sort limit ?,?";
                    console.info(sql)
                    row = await db.Query(sql, [0, param['last_id'] * 5, 5]);
                }else{
                    sql = "select id,name,image,url,create_time,parent_id,`type`,home_nav,sort,`describe` from category where `type` = ? ORDER BY sort";
                    row = await db.Query(sql, 0);
                }

                data.sortList = row
                for (var i in data.sortList) {
                    sql = "select id,name,image,url,create_time,`type`,home_nav,sort from category where `type` = ? and parent_id = ? ORDER BY sort";
                    row = await db.Query(sql, [1, data.sortList[i].id])
                    data.sortList[i].menu = row
                    data.sortList[i].number = 0
                    if(data.sortList[i].menu.length > 0){
                        for(let j in data.sortList[i].menu){
                            sql = "select count(id) from item where category_id_1 = ? and state != 2";
                            row = await db.Query(sql, data.sortList[i].menu[j].id)
                            data.sortList[i].menu[j].number = row[0]['count(id)']
                            data.sortList[i].number = data.sortList[i].number +  data.sortList[i].menu[j].number
                        }
                    }
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

module.exports = shopGetCategory;