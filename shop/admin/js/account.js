var accountVM = new Vue({
    el: '#account',
    data: {
        del_id: '',
        positionList: [{
            name: '全部账号',
            id: 0,
        }],
        position_id: 0,
        accountList: [],

        positionDetailList: [],
        navList: ['子账号管理', '岗位管理'],
        navId: 0,
        last_id: 0,

        pageList: [], // 分页栏
    },
    methods: {
        // 跳转添加推荐位需要
        // changePage: function (e, id) {
        //     if (id) {
        //         if (this.navId == 0) {
        //             let temp = this.accountList.filter(function (res) {
        //                 return res.id == id
        //             })
        //             sessionStorage.setItem("editAccountList", JSON.stringify(temp));
        //         } else {
        //             let temp = this.positionDetailList.filter(function (res) {
        //                 return res.id == id
        //             })
        //             sessionStorage.setItem("editPositionList", JSON.stringify(temp));
        //         }
        //     }
        //
        //     var href = './' + e + '.html'
        //     $("#container").load(href);
        //     sessionStorage.setItem("href", href);
        // },
        // 删除按钮弹窗
        delItem: function (index) {
            const body = (this.accountList[index].nick_name ? this.accountList[index].nick_name : this.accountList[index].username)
            this.del_id = this.accountList[index].id
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('删除')
                modal.find('.modal-body span').text('是否删除账号 "' + body + '" 删除后不可恢复')
            })
        },
        // 分页栏
        getPage: function (index) {
            this.last_id = index
            if (this.navId == 0) {
                getaccount()
            } else {
                getPositionDetail()
            }

        },

        toEditAccount: function (id) {
            let editAccount = this.accountList.filter(function (eData) {
                if (eData.id == id) {
                    return true
                }
                return false
            })
            sessionStorage.setItem('editAccount', JSON.stringify(editAccount))
            window.location.href = 'editAccount'
        }
        // 菜单栏
        // changeNav: function (index) {
        //     this.navId = index
        //     this.last_id = 0
        //     if (this.navId == 0) {
        //         getaccount()
        //     } else {
        //         getPositionDetail()
        //     }
        // },
        // 根据岗位获取账号
        // getAccount: function () {
        //     getaccount()
        // },
    }
})

$(document).ready(function () {
    getaccount()
    // getPosition()
})

// function getPosition() {
//     const url = api.getPosition, async = true
//     let data = {}
//     server(url, data, async, "post", function (res) {
//         accountVM.positionList = accountVM.positionList.concat(res.positionList)
//     })
// }

// function getPositionDetail() {
//     accountVM.pageList = []
//     accountVM.positionDetailList = []
//     const url = api.getPosition, async = true
//     let data = {}
//     data.last_id = accountVM.last_id
//     server(url, data, async, "post", function (res) {
//         if (res.number > 0) {
//             // res.accountList.map(function (fn) {
//             //     fn.create_time = formatTime(new Date(fn.create_time))
//             //     return fn
//             // })
//             accountVM.positionDetailList = res.positionDetailList
//
//             // 分页栏
//             for (let i = 0; i < res.number / 4; i++) {
//                 accountVM.pageList.push(i + 1)
//             }
//         }
//     })
// }

function getaccount() {
    accountVM.pageList = []
    accountVM.accountList = []
    const url = api.getAccount, async = true
    let data = {}
    data.last_id = accountVM.last_id
    data.position_id = accountVM.position_id
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.number > 0) {
            // res.accountList.map(function (fn) {
            //     fn.create_time = formatTime(new Date(fn.create_time))
            //     return fn
            // })
            accountVM.accountList = res.accountList

            // 分页栏
            for (let i = 0; i < res.number / 5; i++) {
                accountVM.pageList.push(i + 1)
            }
        }
    })
}

function delaccount() {
    console.info(accountVM.del_id)
    const url = api.delAccount, async = true
    let data = {}
    data.del_id = accountVM.del_id
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.code == 0) {
            alert('删除成功')
            location.reload()
        }
    })
}
