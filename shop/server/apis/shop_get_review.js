var tools = require("./../tool");

function SHOPGetReview() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPGetReview::Run";
        var data = [];
        var response = tool.error.OK;
        if (!param["goods_id"]) {
            tool.log.warn(name, 'goods_id is not defined')
        } else if (param["goods_id"]) {
            var row = [];
            var sql = ""
            try {
                sql = "select * from review_detail where item_id = ? ORDER BY id limit ?,?"
                row = await tool.query(sql, [param["goods_id"], param['item_last_id'] * 8, 8])
                var rowData = row
                if (rowData.length > 0) {
                    rowData = row.map(function (res) {
                        res.image = JSON.parse(res.image)
                        return res
                    })
                    for (var i in rowData) {
                        if (rowData[i].user_id != 0) {
                            // 获取评价者用户名和头像
                            sql = 'select user_name,avatar from user where id = ?'
                            row = await tool.query(sql, rowData[i].user_id);
                            rowData[i].user_name = row[0].user_name
                            rowData[i].avatar = row[0].avatar
                        }
                    }
                    data = rowData
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPGetReview::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else {
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_review",
            }, res);
    }
}

module.exports = SHOPGetReview;
