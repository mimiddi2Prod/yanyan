var Router = require("./router.js");
// var http = require("http");
var url = require("url");
var fs = require('fs');
var path = require('path');
var ContentType = require("./content-type.js");
var optfile = require('./utils/readImage.js');
// var writefile = require('./uploadImg.js');
var router = new Router();
var port = 9520;

// 初始化数据库连接池
var db = require("./utils/dba");
db.Init()

// 初始化数据库连接池
var privateKey = require("./utils/getPrivateKey");
privateKey.Init()

// var checkYinbaoOrder = require('./api/check_yinbao_order')
// checkYinbaoOrder()

var express = require('express');
var cookieParser = require('cookie-parser');
// var session = require('express-session');
var app = express()

// const hour = 1000 * 60 * 60;
// var sessionOpts = {
//     // 设置密钥
//     secret: 'a cool secret',
//     // Forces the session to be saved back to the session store
//     resave: true,
//     // Forces a session that is "uninitialized" to be saved to the store.
//     saveUninitialized: true,
//     // 设置会话cookie名, 默认是connect.sid
//     key: 'myapp_sid',
//     // If secure is set to true, and you access your site over HTTP, the cookie will not be set.
//     cookie: {maxAge: hour * 2, secure: false}
// }
// app.use(session(sessionOpts))

app.use(cookieParser());
app.use(function (req, res, next) {
    if (req.url === '/favicon.ico') {
        return
    }

    var urlPath = url.parse(req.url).pathname;
    var ext = path.extname(urlPath);
    var contentType = ContentType.GetContentType(ext);
    var type = urlPath.split('/')

    if (type[1] == 'api') {
        // var sess = req.session;
        var data = "";
        req.on('data', function (chunk) {
            data += chunk.toString();
        });
        req.on('end', function () {
            // if (urlPath == "/api/login_check") {
            //     data = JSON.parse(data)
            //     if (sess.user) {
            //         data.serverSessionUser = sess.user
            //     } else {
            //         data.serverSessionUser = ''
            //     }
            //     data = JSON.stringify(data)
            // }

            console.info("on request end, data:\n" + data + ", url:\n" + urlPath);
            router.Service(JSON.parse(data), urlPath, function (json) {
                // if (urlPath == "/api/login") {
                //     // console.info(json)
                //     if (json.text == "login is success") {
                //         let text = ""
                //         let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                //         for (let i = 0; i < 32; i++) {
                //             text += possible.charAt(Math.floor(Math.random() * possible.length))
                //         }
                //         json.str = text
                //         req.session.user = json;
                //     }
                // }

                res.setHeader('Content-Type', 'text/html; charset=utf8');
                res.write(JSON.stringify(json));
                res.end();
            });
        });
    } else if (type[2] == 'fonts' || type[5] == 'font') {
        fs.readFile('./' + req.url, function (err, file) {//主要这里的‘binary’
            if (err) {
                console.log(err);
                return;
            } else {
                console.log("输出文件");
                //res.writeHead(200,  {'Content-Type':'image/jpeg'});
                res.write(file, 'binary');//这里输出的是一个二进制的文件流
                res.end();
            }
        });
    } else if (type[1] == 'css' || type[1] == 'js' || type[1] == 'node_modules' || type[1] == 'jquery-3.3.1' || type[1] == 'bootstrap' || type[1] == 'qiniu-js' || type[1] == 'rsa' || type[1] == 'layDate-v5.0.9' || type[1] == 'jqplot') {
        showPaper(urlPath.substr(1))
    } else if (type[1] == 'images') {
        optfile.readImg('./' + req.url, res);
    } else if (type[1] == 'mp3') {
        optfile.readMp3('./' + req.url, res);
    } else {
        let check_login_status = require('./api/check_login_status')
        let cookie = req.cookies
        let isLogin = check_login_status(cookie)
        // if (!isLogin.text) {
        //     showPaper('index.html')
        //     return false
        // }
        isLogin.then(function (eData) {
            console.info(eData)
            if (!eData.text) {
                showPaper('index.html')
            } else if (eData.type == 0) {
                if (type[1] == '') {
                    showPaper('index.html')
                } else if (type[1] == 'home') {
                    showPaper('html/home.html');
                } else if (type[1] == 'goods') {
                    showPaper('html/goods.html');
                } else if (type[1] == 'addGoods') {
                    showPaper('html/addGoods.html');
                } else if (type[1] == 'editGoods') {
                    showPaper('html/editGoods.html');
                } else if (type[1] == 'reviewGoods') {
                    showPaper('html/reviewGoods.html');
                } else if (type[1] == 'groupGoods') {
                    showPaper('html/groupGoods.html');
                } else if (type[1] == 'groupRefund') {
                    showPaper('html/groupRefund.html');
                } else if (type[1] == 'category') {
                    showPaper('html/category.html');
                } else if (type[1] == 'order') {
                    showPaper('html/order.html');
                } else if (type[1] == 'orderDetail') {
                    showPaper('html/orderDetail.html');
                } else if (type[1] == 'brand') {
                    showPaper('html/brand.html');
                } else if (type[1] == 'addBrand') {
                    showPaper('html/addBrand.html');
                } else if (type[1] == 'editBrand') {
                    showPaper('html/editBrand.html');
                } else if (type[1] == 'recommend') {
                    showPaper('html/recommend.html');
                } else if (type[1] == 'addRecommend') {
                    showPaper('html/addRecommend.html');
                } else if (type[1] == 'editRecommend') {
                    showPaper('html/editRecommend.html');
                } else if (type[1] == 'navigation') {
                    showPaper('html/navigation.html');
                } else if (type[1] == 'waterfall') {
                    showPaper('html/waterfall.html');
                } else if (type[1] == 'customer') {
                    showPaper('html/customer.html');
                } else if (type[1] == 'account') {
                    showPaper('html/account.html');
                } else if (type[1] == 'addAccount') {
                    showPaper('html/addAccount.html');
                } else if (type[1] == 'editAccount') {
                    showPaper('html/editAccount.html');
                } else if (type[1] == 'addPosition') {
                    showPaper('html/addPosition.html');
                } else if (type[1] == 'yinbao') {
                    showPaper('html/yinbao.html');
                } else if (type[1] == 'brunchBanner') {
                    showPaper('html/brunchBanner.html');
                } else if (type[1] == 'addBrunchBanner') {
                    showPaper('html/addBrunchBanner.html');
                } else if (type[1] == 'brunchOrder') {
                    showPaper('html/brunchOrder.html');
                } else if (type[1] == 'yinbaoOrder') {
                    showPaper('html/yinbaoOrder.html');
                } else if (type[1] == 'coupon') {
                    showPaper('html/coupon.html');
                } else if (type[1] == 'store') {
                    showPaper('html/store.html');
                } else if (type[1] == 'panicBuying') {
                    showPaper('html/panicBuying.html')
                } else if (type[1] == 'delivery') {
                    showPaper('html/delivery.html');
                } else {
                    showPaper('html/404.html')
                }
            } else if (eData.type == 1) {
                if (type[1] == '') {
                    showPaper('index.html')
                } else if (type[1] == 'goods') {
                    showPaper('html/goods.html');
                } else if (type[1] == 'addGoods') {
                    showPaper('html/addGoods.html');
                } else if (type[1] == 'editGoods') {
                    showPaper('html/editGoods.html');
                } else if (type[1] == 'order') {
                    showPaper('html/order.html');
                } else if (type[1] == 'orderDetail') {
                    showPaper('html/orderDetail.html');
                } else if (type[1] == 'recommend') {
                    showPaper('html/recommend.html');
                } else if (type[1] == 'addRecommend') {
                    showPaper('html/addRecommend.html');
                } else if (type[1] == 'editRecommend') {
                    showPaper('html/editRecommend.html');
                } else if (type[1] == 'navigation') {
                    showPaper('html/navigation.html');
                } else if (type[1] == 'waterfall') {
                    showPaper('html/waterfall.html');
                } else if (type[1] == 'coupon') {
                    showPaper('html/coupon.html');
                } else if (type[1] == 'panicBuying') {
                    showPaper('html/panicBuying.html')
                } else {
                    showPaper('html/404.html')
                }
            } else if (eData.type == 2) {
                if (type[1] == '') {
                    showPaper('index.html')
                } else if (type[1] == 'delivery') {
                    showPaper('html/delivery.html');
                } else {
                    showPaper('html/404.html')
                }
            }
            // else if (eData.type == 2) {
            //             if (type[1] == '') {
            //                 showPaper('index.html')
            //             } else if (type[1] == 'yinbao') {
            //                 showPaper('html/yinbao.html');
            //             } else if (type[1] == 'brunchBanner') {
            //                 showPaper('html/brunchBanner.html');
            //             } else if (type[1] == 'addBrunchBanner') {
            //                 showPaper('html/addBrunchBanner.html');
            //             } else if (type[1] == 'brunchOrder') {
            //                 showPaper('html/brunchOrder.html');
            //             } else if (type[1] == 'yinbaoOrder') {
            //                 showPaper('html/yinbaoOrder.html');
            //             } else {
            //                 showPaper('html/404.html')
            //             }
            //         }
        })


    }

    function showPaper(pathName) {
        fs.readFile(pathName, function (err, data) {
            if (err) {
                console.log(err);
                // HTTP 状态码: 404 : NOT FOUND
                // Content Type: text/plain
                // res.setHeader('location','http://localhost:9010/index.html/');
                res.setHeader("content-type", contentType);
                // showPaper('index.html');
            } else {
                // HTTP 状态码: 200 : OK
                // Content Type: text/plain
                if (ext == ".css") {
                    res.setHeader('Content-Type', 'text/css');
                } else {
                    res.setHeader("content-type", contentType);
                }
                // 响应文件内容
                res.write(data.toString());
            }
            //  发送响应数据
            res.end();
        });
    }
});

app.listen(port);
console.info("server work on port:" + port);