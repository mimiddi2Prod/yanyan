var tools = require("./../tool");
const qiniuConfig = require("./../config/qiniuConfig")

function SHOPAddReview() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPAddReview::Run";
        var data = {};
        var response = tool.error.OK;
        if (!param["user_id"]) {
            tool.log.warn(name, 'user_id is not defined')
        } else if (!param["text"]) {
            tool.log.warn(name, 'text is not defined')
        } else {
            var row = [];
            var sql = ""
            try {
                var img_list = []
                var qiniuRootUrl = qiniuConfig.qiniuRootUrl
                if (param["img_name_list"].length > 0) {
                    img_list = param["img_name_list"].map(function (res) {
                        return qiniuRootUrl + res
                    })
                }
                img_list = JSON.stringify(img_list)
                sql = "insert into review_detail(text,image,user_id,trade_id,create_time)values(?,?,?,?,CURRENT_TIMESTAMP)"
                row = await tool.query(sql, [param["text"], img_list, param["user_id"], param["trade_id"]]);
                if (row.affectedRows == 1) {
                    data.text = "评论成功"

                    sql = "update `order` set state = ? where tradeId = ?"
                    row = await tool.query(sql, [4, param["trade_id"]]);
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPAddReview::Run", "code:", err.code, ", sql:", err.sql);
            }
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "add_review",
            }, res);
    }
}

module.exports = SHOPAddReview;
