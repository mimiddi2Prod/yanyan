var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateCategory() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // var qiniuRootUrl = "http://notwastingqiniu.minidope.com/"
            // 单张图上传
            // var img = qiniuRootUrl + param['imgList'][0]

            // let adImg = param["imgList"].map(function (res) {
            //     if (res.key) {
            //         return qiniuRootUrl + res.key
            //     }
            //     return res.tempFilePath
            // })
            // adImg = adImg[0]

            // sql = "update category set sort = ? where id = ?";
            // row = await db.Query(sql, [param['sort'], param['id']]);
            // console.info(row)
            // if (row.changedRows == 1) {
            //     data.code = 0
            //     data.text = '编辑成功'
            // } else {
            //     data.code = 1
            //     data.text = '编辑失败'
            // }

            // 单张图上传
            var img = ''
            if (param['imgList'][0].indexOf(qiniuRootUrl) == -1) {
                img = qiniuRootUrl + param['imgList'][0]
            } else {
                img = param['imgList'][0]
            }
            console.info(param)
            console.info(img)
            sql = "update category set `name` = ?,image = ?,url = ?,create_time = current_timestamp ,user_id = ?,parent_id = ?,`type` = ?,sort = ?,`describe` = ? where id = ?";
            row = await db.Query(sql, [param['name'], img, param['url'], param['user_id'], param['parent_id'], param['type'], param['sort'], param['describe'], param['id']]);
            console.info(row)
            if (row.changedRows == 1) {
                data.code = 0
                data.text = '编辑成功'
            } else {
                data.code = 1
                data.text = '编辑失败'
            }
            // sql = "insert into category(`name`,image,url,create_time,user_id,parent_id,`type`,home_nav,sort,`describe`)values(?,?,?,CURRENT_TIMESTAMP,?,?,?,?,?,?)";
            // row = await db.Query(sql, [param['name'], img, param['url'], param['user_id'], param['parent_id'], param['type'], 1, param['sort'], param['describe']]);
            // console.info(row)
            // if (row.insertId) {
            //     data.text = '添加成功'
            // } else {
            //     data.text = '添加失败'
            // }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateCategory;