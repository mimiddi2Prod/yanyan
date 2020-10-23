// var tools = require("./tool");
var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl
function shopAddAd() {
    // var tool = new tools;
    // var query = tool.query;
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

            sql = "insert into advertisement(`type`,url,image,text,create_time,user_id,sort,state)values(?,?,?,?,CURRENT_TIMESTAMP,?,?,?)";
            row = await db.Query(sql, [param['type'], param['url'], img, param['text'], param['user_id'], param['sort'], param['state']]);
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

module.exports = shopAddAd;