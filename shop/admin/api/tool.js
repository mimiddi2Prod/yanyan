// var FBLog = require("./../utils/log");
var db = require("./mysqlEx.js");
// var FBError = require("./fb_error");
// var _MakeResponse = require("./fb_response");
// var _SendTo = require("./../utils/tcp_client");

function Tools(){
    this.query = db.query;
    // this.log = new FBLog;
    // this.error = new FBError;
    // this.MakeResponse = _MakeResponse;
    // this.randomNumber = function(numberLen){
    //     var numberText = "";
    //     for(var i = 0; i < numberLen; i++){
    //         numberText += Math.floor(Math.random() * 10);
    //     }
    //     return numberText;
    // };
    // this.CheckParam = function(param, arrParamsCheck){
    //     for(var i in arrParamsCheck){
    //         let checkKey = arrParamsCheck[i];
    //         switch(checkKey){
    //             case "op_id":{
    //                 if(!param["op_id"]){
    //                     return {state: false, res:this.error.ErrorNotOpIdCode};
    //                 }
    //                 break;
    //             }
    //             case "nick_name":{
    //                 if(!param["nick_name"]){
    //                     return {state: false, res: this.error.ErrorNotNickName};
    //                 }
    //                 break;
    //             }
    //             case "user_type":{
    //                 if(!param["user_type"]){
    //                     return {state: false, res: this.error.ErrorUserType};
    //                 }
    //                 break;
    //             }
    //             case "phone":{
    //                 if(!param["phone"]){
    //                     return {state: false, res: this.error.ErrorNotPhone};
    //                 }
    //                 break;
    //             }
    //             case "box_id":{
    //                 if(!param["box_id"]){
    //                     return {state: false, res: this.error.ErrorNotFoundBoxId};
    //                 }
    //                 break;
    //             }
    //             case "grid_id":{
    //                 if(!param["grid_id"]){
    //                     return {state: false, res: this.error.ErrorNotFoundBoxId};
    //                 }
    //                 break;
    //             }
    //             case "box_size":{
    //                 if(!param["box_size"]){
    //                     return {state: false, res: this.error.ErrorNotFoundBoxSize};
    //                 }
    //                 break;
    //             }
    //             case "pull_vcode":{
    //                 if(!param["pull_vcode"]){
    //                     return {state: false, res: this.error.ErrorNotPullVCode};
    //                 }
    //                 break;
    //             }
    //             case "user_id":{
    //                 if(!param["user_id"]){
    //                     return {state: false, res: this.error.ErrorNotPostmanId};
    //                 }
    //             }
    //             default:
    //                 break;
    //         }
    //     }
    //     return {state: true, res:this.error.OK};
    // };
    // this.SendTo = _SendTo;
}

module.exports = Tools;