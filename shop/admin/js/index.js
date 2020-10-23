var VM = new Vue({
    el: '#login',
    data: {
        username: '',
        password: '',
    },
    methods: {
        submit: function () {
            if (!this.username) {
                alert('请填写账号')
                return false
            }
            if (!this.password) {
                alert('请填写密码')
                return false
            }
            const password = encryptKey(this.password)
            login(this.username, password)
        }
    }
})
var key = ''
$(document).ready(function () {
    getPublic()
})

$(document).keypress(function (e) {
    var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
    if (eCode == 13) {
        // alert('您按了回车键')
        VM.submit()
    }
});

function getPublic() {
    const url = api.getPublic
    let data = {}, async = false
    server(url, data, async, "post", function (res) {
            // console.info(res)
            if (res.key) {
                key = res.key
            }
        }
    )
}

function encryptKey(str) {
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(key)
    const encryptKey = encrypt.encrypt(str)
    return encryptKey
}

function login(username, password) {
    const url = api.login, async = true
    let data = {}
    data.username = username
    data.password = password
    server(url, data, async, "post", function (res) {
        if (res.text == "login is success") {
            // console.info(res)
            let current_time = new Date()
            current_time.setTime(current_time.getTime() + 12 * 60 * 60 * 1000);
            document.cookie = 'id' + "=" + res.id + ";expires=" + current_time.toGMTString() + ";path=/";
            document.cookie = 'token' + "=" + res.token + ";expires=" + current_time.toGMTString() + ";path=/";

            sessionStorage.setItem("user_id", res.id);
            sessionStorage.setItem("type", res.type);
            if (res.type == 0) {
                window.location.href = './home';
            } else if (res.type == 1) {
                window.location.href = './goods';
                sessionStorage.setItem("cate", res.cate);
                sessionStorage.setItem("brand", res.brand)
            } else if (res.type == 2) {
                window.location.href = './delivery';
            }
        } else {
            alert(res.text)
        }
    })
}