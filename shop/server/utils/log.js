var LogLevel = "w|r|g|y|b|p";//white, red, green, yellow, blue, purple
var MakeHead = function (name) {
    var date = new Date();
    var strDate =
        date.getUTCMonth() + "/" + date.getUTCDate() + " "
        + date.getHours() + ":" + date.getMinutes() + ":"
        + date.getSeconds() + "." + date.getMilliseconds();
    let strLog = "[" + strDate + "][" + name + "]:";
    return strLog;
}

module.exports = {
    debug: function (name, ...vars) {
        if (LogLevel.indexOf("w") == -1) {
            return;
        }
        let strLog = MakeHead(name);
        for (let i = 0; i < vars.length; i++) {
            strLog += vars[i];
        }
        console.info(strLog);
    },
    error: function (name, ...vars) {
        if (LogLevel.indexOf("r") == -1) {
            return;
        }
        let strLog = MakeHead(name);
        for (let i = 0; i < vars.length; i++) {
            strLog += vars[i];
        }
        console.info('\x1b[31m%s\x1b[0m', strLog);//red output
    },
    info: function (name, ...vars) {
        if (LogLevel.indexOf("g") == -1) {
            return;
        }
        let strLog = MakeHead(name);
        for (let i = 0; i < vars.length; i++) {
            strLog += vars[i];
        }
        console.info('\x1b[32m%s\x1b[0m', strLog);//green output
    },
    warn: function (name, ...vars) {
        if (LogLevel.indexOf("y") == -1) {
            return;
        }
        let strLog = MakeHead(name);
        for (let i = 0; i < vars.length; i++) {
            strLog += vars[i];
        }
        console.info('\x1b[33m%s\x1b[0m', strLog);//yellow output
    }
}
