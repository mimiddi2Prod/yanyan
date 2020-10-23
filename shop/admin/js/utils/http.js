// async : false / true
function server(url, data = {}, async, method = 'GET', callback) {
    // console.info('请求地址：\n' + url)
    // console.info('请求数据：\n')
    // console.info(data)
    data = JSON.stringify(data)
    $.ajax({
        url: url,
        type: method,
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        async: async,
        data: data,
        success: function (res) {
            return callback(res)
        }
    })
}