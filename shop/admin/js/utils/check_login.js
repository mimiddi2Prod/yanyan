function check_login(callback) {
    const url = '../api/login_check'
    let data = {}
    if(!sessionStorage.getItem('str')){
        window.location.href = "index"
        return false
    }else{
        data.str = sessionStorage.getItem('str')
        server(url, data, "post", function (res) {
            if (res.code == 1) {
                window.location.href = "index"
            } else if (res.code == 0) {
                return callback(res.user)
            }
        })
    }
}