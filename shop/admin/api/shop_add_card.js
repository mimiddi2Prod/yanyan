var db = require("./../utils/dba");
var http = require("http")

function shopAddStore() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (!param["card_id"]) {
                console.info("没有card_id")
            } else {
                var postDataJson = JSON.stringify({
                    card_id: param["card_id"],
                })
                var options = {
                    host: '127.0.0.1',
                    port: '9900',
                    path: '/apis/getCard',
                    method: 'POST',
                    form: postDataJson,
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                }

                async function Call() {
                    let e = await HttpPost(options, postDataJson)
                    e = JSON.parse(e)
                    console.info(e)
                    // if(e.code == 0){
                    //     data.cardList = e.data
                    // }
                    if (e.code == 0) {
                        sql = "insert into card_info(card_id,card_type,cash,status,create_time)values(?,?,?,?,CURRENT_TIMESTAMP)";
                        row = await db.Query(sql, [e.data.card.cash.base_info.id, e.data.card.card_type, JSON.stringify(e.data.card.cash),0]);

                        if (row.insertId) {
                            data.code = 1
                            data.text = '添加成功'
                        } else {
                            data.code = 0
                            data.text = '添加失败'
                        }
                    }
                }

                await Call()
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}


async function HttpPost(option, postData) {
    return new Promise(function (resolve, reject) {
        var req = http.request(option, function (res) {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            })
            res.on('end', function (e) {
                resolve(data)
            })
        })
        req.write(postData);
        req.end();
    })
}

module.exports = shopAddStore;
