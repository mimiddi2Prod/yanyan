var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopAddCategory() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // var qiniuRootUrl = "http://notwastingqiniu.minidope.com/"
            // var qiniuRootUrl = "http://ppburep37.bkt.clouddn.com/"  //七牛云测试域名
            // 多张图上传
            // var img = []
            // if (param["imgList"].length > 0) {
            //     img = param["imgList"].map(function (res) {
            //         return qiniuRootUrl + res
            //     })
            // }
            // img = JSON.stringify(img_list)
            // 单张图上传
            var img = qiniuRootUrl + param['imgList'][0]

            sql = "insert into category(`name`,image,url,create_time,user_id,parent_id,`type`,home_nav,sort,`describe`)values(?,?,?,CURRENT_TIMESTAMP,?,?,?,?,?,?)";
            row = await db.Query(sql, [param['name'], img, param['url'], param['user_id'], param['parent_id'], param['type'], 1, param['sort'], param['describe']]);
            console.info(row)
            if (row.insertId) {
                data.text = '添加成功'
            } else {
                data.text = '添加失败'
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

module.exports = shopAddCategory;