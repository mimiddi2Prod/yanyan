var  fs=  require('fs');//node自带的类
module.exports={
    
      readImg:function(path,res){
        fs.readFile(path,'binary',function(err,  file)  {//主要这里的‘binary’
            if  (err)  {
                console.log(err);
                return;
            }else{
                console.log("输出文件");
                    //res.writeHead(200,  {'Content-Type':'image/jpeg'});
                    res.write(file,'binary');//这里输出的是一个二进制的文件流
                    res.end();
            }
        });
     
    }
}