var Log = require("./utils/log");
var db = require("./utils/mysqlEx");
var Error = require("./error");
var _MakeResponse = require("./response");

function Tools(){
    this.query = db.query;
    this.BulkInsert = db.BulkInsert
    this.BulkUpdate = db.BulkUpdate
    this.log = Log;
    this.error = Error;
    this.MakeResponse = _MakeResponse;
}

module.exports = Tools;
