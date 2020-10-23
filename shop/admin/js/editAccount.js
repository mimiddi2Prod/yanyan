var editAccountVM = new Vue({
    el: '#editAccount',
    data: {
        id:'',

        login_name: '',
        nick_name: '',
        password: '',
        check_password: '',

        // positionList: [],
        // position_id: '',
        //
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
            console.info(editAccountVM.categoryList)
            for (let i in editAccountVM.categoryList) {
                if (editAccountVM.categoryList[i].id == id) {
                    editAccountVM.categoryList[i].menu = editAccountVM.categoryList[i].menu.map(function (eData) {
                        eData.checked = editAccountVM.categoryList[i].checked
                        return eData
                    })
                }
            }
        },
        checkedSubCate: function (index) {
            let bool = editAccountVM.categoryList[index].menu.some(function (eData) {
                if (eData.checked) {
                    return true
                }
                return false
            })
            editAccountVM.categoryList[index].checked = bool
        },
        // 商品提交
        submitAccount: function (state) {
            // state 0 保存 1保存并继续添加
            // if (this.login_name == '') {
            //     alert('请填写登录名')
            //     return
            // }
            // if (this.nick_name == '') {
            //     alert('请填写子账号昵称')
            //     return
            // }
            // if (this.password == '') {
            //     alert('请填写密码')
            //     return
            // }
            // if (this.check_password == '') {
            //     alert('请填写确认密码')
            //     return
            // }
            // if (this.password != this.check_password) {
            //     alert('确认密码错误')
            //     return
            // }
            if (editAccountVM.categoryList.length <= 0) {
                alert('请先去添加商品分类')
                return
            }
            editAccountVM.submitCate = [[], []]
            for (let i in editAccountVM.categoryList) {
                if (editAccountVM.categoryList[i].checked) {
                    editAccountVM.submitCate[0].push(editAccountVM.categoryList[i].id)
                    for (let j in editAccountVM.categoryList[i].menu) {
                        if (editAccountVM.categoryList[i].menu[j].checked) {
                            editAccountVM.submitCate[1].push(editAccountVM.categoryList[i].menu[j].id)
                        }
                    }
                }
            }
            if (editAccountVM.submitCate[0].length <= 0) {
                alert('请至少选择一种分类')
                return
            }

            editAccountVM.submitBrand = []
            for (let i in editAccountVM.brandList) {
                if (editAccountVM.brandList[i].checked) {
                    editAccountVM.submitBrand.push(editAccountVM.brandList[i].id)
                }
            }
            if (editAccountVM.submitBrand.length <= 0) {
                alert('请至少选择一种品牌')
                return
            }
            updateAccount(state)
        }
        // // 商品提交
        // submitAccount: function (state) {
        //     // state 0 保存 1保存并继续添加
        //     if (this.login_name == '') {
        //         alert('请填写登录名')
        //         return
        //     }
        //     if (this.nick_name == '') {
        //         alert('请填写子账号昵称')
        //         return
        //     }
        //     if (this.password == '') {
        //         alert('请填写密码')
        //         return
        //     }
        //     if (this.check_password == '') {
        //         alert('请填写确认密码')
        //         return
        //     }
        //     if (this.password != this.check_password) {
        //         alert('确认密码错误')
        //         return
        //     }
        //     if (this.position_id == '') {
        //         alert('请选择岗位与权限')
        //         return
        //     }
        //     addAccount(state)
        // }
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
    let list = JSON.parse(sessionStorage.getItem("editAccount"))[0];
    editAccountVM.submitCate = JSON.parse(list.cate)
    editAccountVM.submitBrand = JSON.parse(list.brand)
    editAccountVM.login_name = list.username
    editAccountVM.nick_name = list.nick_name
    editAccountVM.id = list.id

    editAccountVM.order = list.order == 1 ? true : false
    editAccountVM.recommend = list.recommend == 1 ? true : false
    editAccountVM.navigation = list.navigation == 1 ? true : false
    editAccountVM.waterfall = list.waterfall == 1 ? true : false
    getCategory()
    getBrand()
})

function getCategory() {
    const url = api.getCategory, async = true
    let data = {}
    server(url, data, async, "post", function (res) {
        for (let i in res.sortList) {
            res.sortList[i].checked = false
            if (editAccountVM.submitCate[0].length > 0) {
                for (let j in editAccountVM.submitCate[0]) {
                    if (editAccountVM.submitCate[0][j] == res.sortList[i].id) {
                        res.sortList[i].checked = true
                    }
                }
            }

            res.sortList[i].menu = res.sortList[i].menu.map(function (eData) {
                eData.checked = false
                for (let j in editAccountVM.submitCate[1]) {
                    if (editAccountVM.submitCate[1][j] == eData.id) {
                        eData.checked = true
                        return eData
                    }
                }
                return eData
            })
        }
        editAccountVM.categoryList = res.sortList
    })
}

function getBrand() {
    const url = api.getBrand, async = true
    let data = {}
    server(url, data, async, "post", function (res) {
        // console.info(res)
        for (let i in res) {
            res[i].checked = false
            for (let j in editAccountVM.submitBrand) {
                if (editAccountVM.submitBrand[j] == res[i].id) {
                    res[i].checked = true
                }
            }
        }
        editAccountVM.brandList = res
    })
}

function updateAccount(state) {
    // state 0 保存 1保存并继续添加
    const url = api.updateAccount, async = true
    let data = {}
    data.cate = editAccountVM.submitCate
    data.brand = editAccountVM.submitBrand
    data.id = editAccountVM.id
    data.login_name = editAccountVM.login_name
    data.nick_name = editAccountVM.nick_name
    data.order = editAccountVM.order ? 1 : 0
    data.recommend = editAccountVM.recommend ? 1 : 0
    data.navigation = editAccountVM.navigation ? 1 : 0
    data.waterfall = editAccountVM.waterfall ? 1 : 0

    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.text == '编辑成功') {
            alert('编辑成功')
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
//             editAccountVM.positionList = res.positionDetailList
//         }
//     })
// }
//
// function addAccount(state) {
//     // state 0 保存 1保存并继续添加
//     const url = api.addAccount, async = true
//     let data = {}
//     data.login_name = editAccountVM.login_name
//     data.nick_name = editAccountVM.nick_name
//     data.password = editAccountVM.password
//     data.position_id = editAccountVM.position_id
//     server(url, data, async, "post", function (res) {
//         console.info(res)
//         if (res.text == '添加成功') {
//             alert('添加成功')
//             if (state == 1) {
//                 location.reload()
//             } else {
//                 editAccountVM.changePage('account')
//             }
//         }
//     })
// }