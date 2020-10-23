var tools = require("./../tool");
var fs = require("fs")

function SHOPBeShare() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPBeShare::Run";
        var data = {};
        var response = tool.error.OK;
        try {
            fs.appendFile("log.log", new Date().toLocaleString() + '--小程序数据-- '+ param["tag"] +' openid: ' + JSON.stringify(param["openid"]) +
                '  cardList: ' + JSON.stringify(param["cardList"])  +
                '  cardListCallback: ' + JSON.stringify(param["cardListCallback"])  + '\/n', function (err) {
            })
        } catch (e) {
            console.info(e)
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "card_watcher",
            }, res);
    }
}

module.exports = SHOPBeShare;
