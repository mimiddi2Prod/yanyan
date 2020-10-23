var qiniu = require("qiniu");
module.exports={
    
      writeImg:function(data,res){
		var accessKey = 'PNMoGgck6MYCGFSK9vJLITXbn8ECVRAQfe3xtvvg';
		var secretKey = 'SBTrLBeweBEcXKDIshbVZId7Q6plDX0tdEDjq6Tv';
		var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
		var bucket = "mimiddi";
		
		var keyToOverwrite = data.key;
		var options = {
			scope: bucket + ":" + keyToOverwrite,
		};
		var putPolicy = new qiniu.rs.PutPolicy(options);
		var uploadToken=putPolicy.uploadToken(mac);
		
		return res(uploadToken)
		
     
    }
}



