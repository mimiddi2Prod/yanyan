/* todo 后台 设置 打印完成状态推送地址 用于确认打印完成 失败就再发送一遍？
 *  多方验证 一个是接口返回状态（确认订单推送成功） 一个是打印完成推送（打印成功）
 *  终端状态推送地址 有订单但是没有处于连接状态 则提醒开机
*/
let ylysdk = require('yly-nodejs-sdk')
var fs = require('fs')
const path = require('path')

function YLY() {
}

YLY.Init = function () {
    let yly = require('./../config/ylyConfig')
    let ylyConfig = new ylysdk.Config({
        'cid': yly.cid,
        'secret': yly.secret
    })

    let tokenData = fs.readFileSync(path.join(__dirname, '../config/ylyToken.js')).toString('utf-8')
    if (!tokenData) {
        let oauthClient = new ylysdk.OauthClinet(ylyConfig);
        // 获得access_token
        oauthClient.getToken().then(function (res) {
            if (
                res.error != 0 &&
                res.error_description != 'success'
            ) {
                throw new Error('failed:' + res.error_description);
            }
            tokenData = {
                'accessToken': res.body.access_token,
                'refreshToken': res.body.refresh_token,
            };
            if (res.body.machine_code != null) {
                tokenData.machineCode = res.body.machine_code;
            }
            console.log(tokenData);
            // write
            fs.appendFileSync('./config/ylyToken.js', 'module.exports = {\n' +
                '    access_token: \'' + tokenData.accessToken + '\',\n' +
                '    refresh_token: \'' + tokenData.refreshToken + '\',\n' +
                '    machine_code: \'' + tokenData.machineCode + '\'\n' +
                '}')
        });
    }
    let token = require('./../config/ylyToken')
    if (token.access_token) {
        let RpcClient = new ylysdk.RpcClient(token.access_token, ylyConfig);
        YLY.Print = new ylysdk.Print(RpcClient);
    }
    return YLY.Print;
}

// YLY.ToPrint = function (data, machineCode, originId) {
//     return new Promise(function (resolve, reject) {
//         let repeat = require('repeat-string')
//         // todo 将获得的数据data放入打印单上
//         var content = "<MN>2</MN>"; // 打印两联
//         content += "<FS2><center>**#1 美团**</center></FS2>";
//         content += repeat('.', 32);
//         content += "<FS2><center>--在线支付--</center></FS2>";
//         content += "<FS><center>张周兄弟烧烤</center></FS>";
//         content += "订单时间:2018-12-27 16:23\n";
//         content += "订单编号:40807050607030\n";
//         content += repeat('*', 14) + "商品" + repeat("*", 14);
//         content += "<table>";
//         content += "<tr><td>商品</td><td>数量</td><td>价格</td></tr>";
//         content += "<tr><td>烤土豆(超级辣)</td><td>x3</td><td>5.96</td></tr>";
//         content += "<tr><td>烤豆干(超级辣)</td><td>x2</td><td>3.88</td></tr>";
//         content += "<tr><td>烤鸡翅(超级辣)</td><td>x3</td><td>17.96</td></tr>";
//         content += "<tr><td>烤排骨(香辣)</td><td>x3</td><td>12.44</td></tr>";
//         content += "<tr><td>烤韭菜(超级辣)</td><td>x3</td><td>8.96</td></tr>";
//         content += "</table>";
//         content += repeat('.', 32);
//         content += "<QR>this is qrcode,you can write Officical Account url or Mini Program and so on</QR>";
//         content += "小计:￥82\n";
//         content += "折扣:￥４ \n";
//         content += repeat('*', 32);
//         content += "订单总价:￥78 \n";
//         content += "130515456456 \n";
//         content += "厦门市集美区sxxxxx \n";
//         content += "<FS2><center>**#1 完**</center></FS2>";
//
//         machineCode = "4004639956" //一台设备
//         YLY.Print.index(machineCode, originId, content).then(function (res) {
//             console.log(res);
//             resolve(res);
//         });
//
//     })
// };
// 目前机器码固定一台 originId默认为trade_id
YLY.ToPrint = function (data, machineCode, originId) {
    originId = data.trade_id
    let total_Price = 0
    let orderInfo = ''
    // function () {
    // let temp = ''
    for (let i in data.order) {
        total_Price = (Number(total_Price) + Number(Number(Number(data.order[i].single_price) * Number(data.order[i].number)).toFixed(2))).toFixed(2)
        let price = data.order[i].discount_price > 0 ? data.order[i].discount_price : data.order[i].single_price
        orderInfo += '<tr><td>' + data.order[i].goodsname + '</td><td>x' + data.order[i].number + '</td><td>' + price + '</td></tr>'
    }
    // }()
    let pay_price = total_Price
    console.info(data)
    console.info(orderInfo)
    return new Promise(function (resolve, reject) {
        let repeat = require('repeat-string')
        // todo 将获得的数据data放入打印单上
        var content = "<MN>1</MN>"; // 打印两联
        content += "<FS2><center>**#1 岩岩到家**</center></FS2>";
        content += repeat('.', 32);
        content += "<FS2><center>--在线支付--</center></FS2>";
        content += "<FS><center>岩岩到家赤岩店</center></FS>";
        content += "订单时间:" + data.create_time + "\n";
        content += "订单编号:" + data.trade_id + "\n";
        content += repeat('*', 14) + "商品" + repeat("*", 14);
        content += "<table>";
        content += "<tr><td>商品</td><td>数量</td><td>价格</td></tr>";
        // content += "<tr><td>烤土豆(超级辣)</td><td>x3</td><td>5.96</td></tr>";
        // content += "<tr><td>烤豆干(超级辣)</td><td>x2</td><td>3.88</td></tr>";
        // content += "<tr><td>烤鸡翅(超级辣)</td><td>x3</td><td>17.96</td></tr>";
        // content += "<tr><td>烤排骨(香辣)</td><td>x3</td><td>12.44</td></tr>";
        // content += "<tr><td>烤韭菜(超级辣)</td><td>x3</td><td>8.96</td></tr>";
        content += orderInfo
        content += "</table>";
        content += repeat('.', 32);
        content += "<QR>http://weixin.qq.com/r/xDiBmfPERa46rbf6923W</QR>";
        content += "小计:￥" + total_Price + "\n";
        if (data.reduce_cost) {
            pay_price = pay_price - (data.reduce_cost / 100)
            content += "折扣:￥" + (data.reduce_cost / 100) + " \n";
        }
        pay_price = Number(Number(pay_price) + Number(data.postage)).toFixed(2)
        content += "配送费:￥" + data.postage + " \n";
        content += repeat('*', 32);
        content += "订单总价:￥" + pay_price + " \n";
        content += data.receiver + " \n";
        content += data.tel + " \n";
        content += data.address_text + " \n";
        content += data.note ? data.note + " \n" : "";
        content += "<FS2><center>**#1 完**</center></FS2>";

        machineCode = "4004639956" //一台设备
        YLY.Print.index(machineCode, originId, content).then(function (res) {
            console.log(res);
            resolve(res);
        });

    })
};
module.exports = YLY;