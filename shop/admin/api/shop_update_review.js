var db = require("./../utils/dba");

function shopUpdateReview() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {

            sql = "update review_detail set text = ? where id = ?";
            row = await db.Query(sql, [param['text'], param['id']]);
            if (row.changedRows == 1) {
                data.text = '更改成功'
            } else {
                data.text = '更改失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateReview;