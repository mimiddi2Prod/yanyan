var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopAddBrunchBanner() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // 单张图上传
            var img = qiniuRootUrl + param['imgList'][0]

            sql = "insert into restaurant_banner(category_id,goods_id,`name`,image,status,sort,user_id,`type`,create_time)values(?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)";
            row = await db.Query(sql, [param['category_id'], param['goods_id'], param['name'], img, param['status'], param['sort'], param['user_id'], param['type']]);
            console.info(row)
            if (row.insertId) {
                data.code = 0
                data.text = '添加成功'
            } else {
                data.code = 1
                data.text = '添加失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopAddBrunchBanner;