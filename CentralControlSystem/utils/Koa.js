var Cmd = require('./cmd.js')
var koa = require('koa');
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')();

function Koa() {
}

Koa.Init = function () {
    if (!Koa.app) {
        var server = require('./server.js')
        var Server = new server

        Koa.app = new koa();
        Koa.app.use(async (ctx, next) => {
            console.log(ctx.request.path + ':' + ctx.request.method);
            await next();
        });

        router.get('/apis/:apiName', async (ctx, next) => {
            let apiName = ctx.params.apiName;
            let params = ctx.query
            // todo get处理
            ctx.response.body = await Server.run(apiName, params)
        });

        router.post('/apis/:apiName', async (ctx, next) => {
            let apiName = ctx.params.apiName;
            let params = ctx.request.body
            // todo post处理
            ctx.response.body = await Server.run(apiName, params)
        });

        router.get('/', async (ctx, next) => {
            ctx.response.body = '<h1>Index</h1>';
        });

        Koa.app.use(bodyParser());
        Koa.app.use(router.routes());
        // 在端口监听:
        Koa.app.listen(Cmd.GetCmd("--port", 5463));
    }
}

module.exports = Koa;