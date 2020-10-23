// 初始化数据库连接池
var db = require("./utils/dba");
db.Init()

// 初始化微信api
var wechatApi = require('./utils/wechat_api.js')
wechatApi.Init()

// 初始化HTTP
var Koa = require('./utils/Koa.js')
Koa.Init()