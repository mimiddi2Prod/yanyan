var customerVM = new Vue({
    el: '#customer',
    data: {
        userList: [],
        last_id: 0,

        pageList: [], // 分页栏

        searchString: '',
        issearch: false
    },
    methods: {
        // 跳转添加推荐位需要
        // changePage: function (e, brand_id) {
        //     let temp = this.brandList.filter(function (res) {
        //         return res.id == brand_id
        //     })
        //     sessionStorage.setItem("editBrandList", JSON.stringify(temp));
        //
        //     var href = './' + e + '.html'
        //     $("#container").load(href);
        //     sessionStorage.setItem("href", href);
        // },
        getPage: function (index) {
            this.last_id = index
            getUser()
        },
        IncrementPoints: function (id) {
            let self = this
            let info = this.userList.filter((item) => {
                return item.id == id
            })[0]
            const url = '../api/update_integral', async = true
            let data = {}
            data.integral = parseFloat(info.IncrementPoint) * 100
            data.user_id = info.id
            data.state = info.isNegative ? 1 : 0 // 0 增加 1 减少
            server(url, data, async, "post", function (res) {
                // console.info(res)
                if(res.text == "积分更新成功"){
                    alert("积分更新成功")
                    if(!self.issearch){
                        getUser()
                    }else{
                        self.searchUser()
                    }
                }
            })
        },
        searchUser: function () {
            this.issearch = true
            let self = this
            this.pageList = []
            this.userList = []
            let url = api.getUserBySearch, async = true
            let data = {}
            data.searchString = this.searchString
            server(url, data, async, "post", function (res) {
                console.info(res)
                if (res.userList) {
                    res.userList.map(function (fn) {
                        fn.register_time = formatTime(new Date(fn.register_time))
                        fn.last_login_time = formatTime(new Date(fn.last_login_time))
                        fn.user_name = decodeURIComponent(fn.user_name)
                        fn.IncrementPoint = 0
                        fn.isNegative = false
                        return fn
                    })
                    self.userList = res.userList

                    // 分页栏
                    // for (let i = 0; i < res.number / 4; i++) {
                    //     customerVM.pageList.push(i + 1)
                    // }
                }
            })
        }
    }
})

$(document).ready(function () {
    getUser()
})

function getUser() {
    customerVM.pageList = []
    customerVM.userList = []
    const url = api.getUser, async = true
    let data = {}
    data.last_id = customerVM.last_id
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.number > 0) {
            res.userList.map(function (fn) {
                fn.register_time = formatTime(new Date(fn.register_time))
                fn.last_login_time = formatTime(new Date(fn.last_login_time))
                fn.user_name = decodeURIComponent(fn.user_name)
                fn.IncrementPoint = 0
                fn.isNegative = false
                return fn
            })
            customerVM.userList = res.userList

            // 分页栏
            for (let i = 0; i < res.number / 4; i++) {
                customerVM.pageList.push(i + 1)
            }
        }
    })
}