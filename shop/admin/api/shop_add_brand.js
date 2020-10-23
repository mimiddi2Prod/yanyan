// var tools = require("./tool");
var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopAddBrand() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // 单张图上传
            var img = qiniuRootUrl + param['imgList'][0]

            sql = "insert into brand(image,url,name,price,user_id,create_time,state,sort,`desc`)values(?,?,?,?,?,CURRENT_TIMESTAMP,?,?,?)";
            row = await db.Query(sql, [img, param['url'], param['name'], param['price'], param['user_id'], param['state'], param['sort'], param['desc']]);
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
    }
}

module.exports = shopAddBrand;