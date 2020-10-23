var imgUploadList = []

function qiniuUpload(imgList, type, callback) {
    imgUploadList = imgList
    // console.info('upload in')
    // console.info(imgFiles)
    let flag = 0
    for (let i = 0; i < imgList.length; i++) {
        // let imgsrc = window.URL.createObjectURL(imgFiles[i]);  // 图片预览
        // let urlpath = imgsrc.substring(imgsrc.lastIndexOf("/") + 1).toLowerCase()
        let key = type + getPicKey(i, imgList[i].imgFile.name.substring(imgList[i].imgFile.name.lastIndexOf(".")))
        getUploadToken(i, key, imgList[i].tempFilePath, function () {
            flag++
            if (flag == imgList.length) {
                return callback(imgUploadList)
            }
        })
    }
}

function getPicKey(index, type) {
    let currentTime = new Date()
    let year = currentTime.getFullYear() + '_',
        month = currentTime.getMonth() + 1 + '_',
        day = currentTime.getDate() + '_',
        hours = currentTime.getHours() + '_',
        minutes = currentTime.getMinutes() + '_',
        seconds = currentTime.getSeconds() + '_'
    return year + month + day + hours + minutes + seconds + index + type
}

function getUploadToken(index, key, imgsrc, callback) {
    let data = {}
    data.key = key
    data.tempFilePath = imgsrc
    data = JSON.stringify(data)
    const url = '../api/get_uploadToken'
    $.ajax({
        url: url,
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        data: data,
        async: false,
        success: function (res) {
            console.info(res)
            // for (let i in imgUploadList) {
            //     if (imgUploadList[i].key == key) {
            //         imgUploadList[]
            //     }
            // }
            imgUploadList[index].uploadToken = res.uploadToken
            imgUploadList[index].key = res.key
            return callback()
        }
    })

    // $.when(myajax).done(function () {
    //     //要执行的操作
    //     return imgUploadList
    // });
}

function uploadImg(key, token, file, callback) {
    var putExtra = {
        fname: key,
        params: {},
        mimeType: null
    };

    var observer = {
        next(res) {
            // ...
        },
        error(err) {
            // ...
        },
        complete(res) {
            // ...
            // console.info(res)
            return callback(res)
        }
    }
    var config = {
        useCdnDomain: true,
        region: qiniu.region.z0
    };

    var observable = qiniu.upload(file, key, token, putExtra, config)
    var subscription = observable.subscribe(observer) // 上传开始

}