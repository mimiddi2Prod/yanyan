var addAccountVM = new Vue({
    el: '#addAccount',
    data: {
        login_name: '',
        nick_name: '',
        password: '',
        check_password: '',

        // positionList: [],
        // position_id: '',

        // select_position_detail: {},

        categoryList: [],
        submitCate: [[], []],

        brandList: [],
        submitBrand: [],

        order: false,
        recommend: false,
        navigation: false,
        waterfall: false
    },
    methods: {
        checkedCate: function (id) {
            console.info(addAccountVM.categoryList)
            for (let i in addAccountVM.categoryList) {
                if (addAccountVM.categoryList[i].id == id) {
                    addAccountVM.categoryList[i].menu = addAccountVM.categoryList[i].menu.map(function (eData) {
                        eData.checked = addAccountVM.categoryList[i].checked
                        return eData
                    })
                }
            }
        },
        checkedSubCate: function (index) {
            let bool = addAccountVM.categoryList[index].menu.some(function (eData) {
                if (eData.checked) {
                    return true
                }
                return false
            })
            addAccountVM.categoryList[index].checked = bool
        },
        // 商品提交
        submitAccount: function (state) {
            // state 0 保存 1保存并继续添加
            if (this.login_name == '') {
                alert('请填写登录名')
                return
            }
            if (this.nick_name == '') {
                alert('请填写子账号昵称')
                return
            }
            if (this.password == '') {
                alert('请填写密码')
                return
            }
            if (this.check_password == '') {
                alert('请填写确认密码')
                return
            }
            if (this.password != this.check_password) {
                alert('确认密码错误')
                return
            }
            // if (this.position_id == '') {
            //     alert('请选择岗位与权限')
            //     return
            // }
            if (addAccountVM.categoryList.length <= 0) {
                alert('请先去添加商品分类')
                return
            }

            addAccountVM.submitCate = [[], []]
            for (let i in addAccountVM.categoryList) {
                if (addAccountVM.categoryList[i].checked) {
                    addAccountVM.submitCate[0].push(addAccountVM.categoryList[i].id)
                    for (let j in addAccountVM.categoryList[i].menu) {
                        if (addAccountVM.categoryList[i].menu[j].checked) {
                            addAccountVM.submitCate[1].push(addAccountVM.categoryList[i].menu[j].id)
                        }
                    }
                }
            }
            addAccountVM.submitBrand = []
            for (let i in addAccountVM.brandList) {
                if (addAccountVM.brandList[i].checked) {
                    addAccountVM.submitBrand.push(addAccountVM.brandList[i].id)
                }
            }
            if (addAccountVM.submitCate[0].length <= 0 && addAccountVM.submitBrand.length > 0) {
                alert('请至少选择一种分类')
                return
            }

            if (addAccountVM.submitBrand.length <= 0 && addAccountVM.submitCate[0].length > 0) {
                alert('请至少选择一种品牌')
                return
            }
            addAccount(state)
        }
    },
    // watch: {
    //     position_id: function (val) {
    //         if (val) {
    //             this.select_position_detail = this.positionList.filter(function (res) {
    //                 return res.id == val
    //             })[0]
    //         }
    //     }
    // }
})

$(document).ready(function () {
    // getPosition()
    getCategory()
    getBrand()
})

function getCategory() {
    const url = api.getCategory, async = true
    let data = {}
    server(url, data, async, "post", function (res) {
        for (let i in res.sortList) {
            res.sortList[i].checked = false
            res.sortList[i].menu = res.sortList[i].menu.map(function (eData) {
                eData.checked = false
                return eData
            })
        }
        addAccountVM.categoryList = res.sortList
    })
}

function getBrand() {
    const url = api.getBrand, async = true
    let data = {}
    server(url, data, async, "post", function (res) {
        console.info(res)
        for (let i in res) {
            res[i].checked = false
        }
        addAccountVM.brandList = res
    })
}

function addAccount(state) {
    // state 0 保存 1保存并继续添加
    const url = api.addAccount, async = true
    let data = {}
    data.login_name = addAccountVM.login_name
    data.password = addAccountVM.password
    data.nick_name = addAccountVM.nick_name
    data.cate = addAccountVM.submitCate
    data.brand = addAccountVM.submitBrand
    data.order = addAccountVM.order ? 1 : 0
    data.recommend = addAccountVM.recommend ? 1 : 0
    data.navigation = addAccountVM.navigation ? 1 : 0
    data.waterfall = addAccountVM.waterfall ? 1 : 0

    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.text == '添加成功') {
            alert('添加成功')
            if (state == 1) {
                location.reload()
            } else {
                window.location.href = 'account'
            }
        }
    })
}

// function getPosition() {
//     const url = api.getPosition, async = true
//     let data = {}
//     data.last_id = -1
//     server(url, data, async, "post", function (res) {
//         console.info(res)
//         if (res.positionDetailList) {
//             addAccountVM.positionList = res.positionDetailList
//         }
//     })
// }
//
// function addAccount(state) {
//     // state 0 保存 1保存并继续添加
//     const url = api.addAccount, async = true
//     let data = {}
//     data.login_name = addAccountVM.login_name
//     data.nick_name = addAccountVM.nick_name
//     data.password = addAccountVM.password
//     data.position_id = addAccountVM.position_id
//     server(url, data, async, "post", function (res) {
//         console.info(res)
//         if (res.text == '添加成功') {
//             alert('添加成功')
//             if (state == 1) {
//                 location.reload()
//             } else {
//                 addAccountVM.changePage('account')
//             }
//         }
//     })
// }