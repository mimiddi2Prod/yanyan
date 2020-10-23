var tools = require("./../tool");
var https = require('https');
var fs = require('fs')
const appid = 'wx14dd6120d4882a81';
const secret = 'b77ba947d1168d6eff00816ea2f0cf5d';

function SHOPGetWxacodeunlimit() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetWxacodeunlimit::Run";
        log.debug("SHOPGetWxacodeunlimit::Run.in");
        var data = {};
        var response = tool.error.OK;
        // if (!param["code"]) {
        //     log.warn('没有用户登录凭证code')
        //     // response = tool.error.ErrorNotCode;
        // } else {
        try {
            var options = {
                host: 'api.weixin.qq.com',
                path: '/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            async function Call() {
                var e = await HttpsGet(options)

                let access_token = JSON.parse(e).access_token
                console.info(access_token)

                let postData = JSON.stringify({
                    // access_token: access_token,
                    scene: 'id=19',
                    page: 'pages/goods/goods',
                    width: 430
                })

                options = {
                    host: 'api.weixin.qq.com',
                    path: '/wxa/getwxacodeunlimit?access_token=' + access_token,
                    method: 'POST',
                    form: postData,
                    headers: {
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Type': 'application/json',
                        'Content-Length': postData.length
                    },
                    encoding: 'binary'
                }

                async function CallCODE() {
                    e = await HttpsPost(options, postData)
                    console.info(e)

                    // var base64Image = JSON.parse(e).imgBuffer.toString('base64')
                    // console.info(base64Image)
                    // var decodedImage = new Buffer(base64Image, 'base64');
                    // console.info(decodedImage)
                    // var b = JSON.parse(e)
                    // console.info(b)
                    fs.writeFile('./index.png', e, function (err) {
                        if (err) {
                            throw err;
                        }
                    })
                }

                await CallCODE()
                // data = JSON.parse(e)
                // var request = require('request');
                // var postData = {scene: 'id=1'};
                // let postData = {
                //     access_token: access_token,
                //     scene: 'id',
                //     page:'pages/index/index',
                //     width:430
                // }
                // request.post({url:'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + access_token, formData: postData}, function optionalCallback(err, httpResponse, body) {
                //     if (err) {
                //         return console.error('upload failed:', err);
                //     }
                //     console.info(body)
                //     console.log('Upload successful!',body);
                //     // remoteUrl = remoteUrl+JSON.parse(body).updatedVersion+'/';
                //     // console.log("remoteUrl:"+remoteUrl);
                // });
            }

            await Call()
        } catch (err) {
            if (err.code) {
                response = tool.error.ErrorSQL;
                log.warn(name, "code:", err.code, ", sql:", err.sql);
            } else {
                log.warn(name, JSON.stringify(response));
                response = tool.error.ErrorCatch;
            }
        }
        // }

        if (response.code != tool.error.OKCode) {
            log.warn(name, JSON.stringify(response));
        }

        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_openid",
            }, res);
        tool.log.debug("SHOPGetWxacodeunlimit::Run.out");
    }
}

async function HttpsGet(option) {
    return new Promise(function (resolve, reject) {
        https.get(option, function (res) {
            let data = ''
            res.on('data', function (chunk) {
                data += chunk;
            })
            res.on('end', function (e) {
                resolve(data)
            })
        })
    })
}

async function HttpsPost(option, postData) {
    return new Promise(function (resolve, reject) {
        var req = https.request(option, function (res) {
            let data = ''
            res.setEncoding('binary')
            res.on('data', function (chunk) {
                data += chunk;
            })
            res.on('end', function (e) {
                const contentType = res.headers['content-type'];
                if (!contentType.includes('image')) {
                    console.log('获取小程序码图片失败，微信api返回的json为：')
                    console.log(JSON.parse(data))
                    return resolve(null);
                }
                const imgBuffer = Buffer.from(data, 'binary');
                // resolve({imgBuffer, contentType});
                resolve(imgBuffer)
            })
        })
        req.write(postData);
        req.end();
    })
}

module.exports = SHOPGetWxacodeunlimit;