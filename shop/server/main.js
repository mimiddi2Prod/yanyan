const http = require('http');
const Cmd = require('./utils/CuteCmd.js');
const url = require('url');
var Router = require("./router.js");

const contentType = {"content-type": "text/html;charset=utf-8"};

var checkStock = require('./apis/shop_checkStock')
checkStock()

var yly = require("./utils/yly")
yly.Init()

http.createServer(function (req, res) {
    var reqUrl = req.url;
    var path = url.parse(reqUrl).pathname;
    if (path.indexOf("favicon.ico") != -1) {
        res.writeHead(404, contentType);
        res.write("<h1>404</h1>");
        res.end();
        return;
    }
    let postRaw = '';
    req.on('data', function (chunk) {
        postRaw += chunk;
        if (reqUrl == '/apis/shop_wxPay_notify') {
            var wxPayNotify = require("./apis/shop_wxPay_notify")
            var work = new wxPayNotify()
            work.run(postRaw)
        } else if (reqUrl == '/apis/shop_wxRefund_notify') {
            var wxRefundNotify = require("./apis/shop_wxRefund_notify")
            var work = new wxRefundNotify()
            work.run(postRaw)
        }
    })
    req.on('end', function () {
        try {
            var params = JSON.parse(postRaw);
            res.writeHead(200, contentType);
            var router = new Router;
            router.Run(path, params, res);
        } catch (err) {
            res.writeHead(404, contentType);
            res.write("{}");
            res.end();
        }
    })

}).listen(Cmd.GetCmd("--port", 5463));
