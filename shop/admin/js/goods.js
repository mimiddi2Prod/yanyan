var goodsVM = new Vue({
    el: '#goods',
    data: {
        last_id: 0,
        goods_state: -1, // -1全部 / 0出售中 / 1出售完 / 2已下架
        need_integral: 0,
        goodsList: [],
        checkboxAll: false,
        pageList: [], // 分页栏

        paramShow: true,

        navList: ['全部', '出售中', '已售完', '已下架'],
        nav_tow_List: ['普通商品', '积分商品'],
        navId: 0,
        navTwoId: 0,

        // 批量分类
        category_parent: [],
        category: [],
        category_parent_id_select: '',
        category_id_select: '',

        // 批量改价
        radioList: [{
            id: 1,
            text: '直接修改价格：设置统一价格'
        }, {
            id: 2,
            text: '运用统一公式修改价格'
        }],
        choose_type: 1,
        calcList: [{
            id: 1,
            name: '加'
        }, {
            id: 2,
            name: '减'
        }, {
            id: 3,
            name: '乘'
        }, {
            id: 4,
            name: '除'
        }],
        calc_type: 1,
        calc_number_one: '',
        calc_number_two: '',
        previewGoodsPrice: [],


        user_type: '',

        searchString: '',
    },
    methods: {
        searchGoods: function () {
            goodsVM.pageList = []
            goodsVM.goodsList = []
            let url = api.getGoodsBySearch, async = true
            let data = {}
            data.searchString = this.searchString
            server(url, data, async, "post", function (res) {
                console.info(res)
                if (res.length > 0) {
                    res = res.map(function (resData) {
                        resData.price = Number(resData.price).toFixed(2)
                        resData.create_time = formatTime(new Date(resData.create_time))
                        // resData.showMoreParam = false
                        // let total_stock = 0
                        // for (let i in resData.param) {
                        //     total_stock = total_stock + resData.param[i].stock
                        //     resData.param[i].price = Number(resData.param[i].price).toFixed(2)
                        // }
                        // resData.total_stock = total_stock
                        resData.checked = false
                        return resData
                    })
                    goodsVM.goodsList = res
                }
                // if (res.number > 0) {
                //     res.list = res.list.map(function (resData) {
                //         resData.price = Number(resData.price).toFixed(2)
                //         resData.create_time = formatTime(new Date(resData.create_time))
                //         // resData.showMoreParam = false
                //         // let total_stock = 0
                //         // for (let i in resData.param) {
                //         //     total_stock = total_stock + resData.param[i].stock
                //         //     resData.param[i].price = Number(resData.param[i].price).toFixed(2)
                //         // }
                //         // resData.total_stock = total_stock
                //         resData.checked = false
                //         return resData
                //     })
                //     // console.info(res)
                //     goodsVM.goodsList = res.list
                //
                //     // 分页栏
                //     for (let i = 0; i < res.number / 5; i++) {
                //         goodsVM.pageList.push(i + 1)
                //     }
                // }
            })
        },
        // changePage: function (e, goods_id) {
        //     if (e == 'goods-edit') {
        //         let temp = this.goodsList.filter(function (res) {
        //             return res.id == goods_id
        //         })
        //         sessionStorage.setItem("editGoodsList", JSON.stringify(temp));
        //     }
        //     if (e == 'goods-review') {
        //         let temp = this.goodsList.filter(function (res) {
        //             return res.id == goods_id
        //         })
        //         let info = {}
        //         info.item_id = temp[0].id
        //         info.name = temp[0].name
        //         info.image = temp[0].image[0]
        //         info.review_id = temp[0].review_id
        //         sessionStorage.setItem("goods_review", JSON.stringify(info));
        //     }
        //     var href = './' + e + '.html'
        //     $("#container").load(href);
        //     sessionStorage.setItem("href", href);
        // },
        // 跳转编辑页面
        editGoods: function (goods_id) {
            let temp = this.goodsList.filter(function (eData) {
                return eData.id == goods_id
            })
            sessionStorage.setItem("editGoods", JSON.stringify(temp));
            window.location.href = "editGoods"
        },
        reviewGoods: function (goods_id) {
            let temp = this.goodsList.filter(function (eData) {
                return eData.id == goods_id
            })
            let info = {}
            info.item_id = temp[0].id
            info.name = temp[0].name
            info.image = temp[0].image[0]
            info.review_id = temp[0].review_id
            sessionStorage.setItem("reviewGoods", JSON.stringify(info));
            window.location.href = "reviewGoods"
        },
        changeNav: function (index) {
            this.navId = index
            this.last_id = 0
            // state -1全部 0在售 1售罄 2下架
            console.info(index)
            if (index == 0) {
                this.goods_state = -1
            } else if (index == 1) {
                this.goods_state = 0
            } else if (index == 2) {
                this.goods_state = 1
            } else if (index == 3) {
                this.goods_state = 2
            }
            getGoods()
        },
        changeNavTwo: function (index) {
            this.navTwoId = index
            this.last_id = 0
            // state -1全部 0在售 1售罄 2下架
            console.info(index)
            if (index == 0) {
                this.need_integral = 0
            } else if (index == 1) {
                this.need_integral = 1
            }
            getGoods()
        },
        // checkAll: function (e) {
        //     var checkboxAll = $("input[name='checkbox-all']")[0].checked
        //     var check = $("input[name='checkGoods']")
        //     for (var i in check) {
        //         check[i].checked = checkboxAll
        //     }
        // },
        checkAll: function () {
            if (this.checkboxAll) {
                this.goodsList.map(function (fn) {
                    fn.checked = true
                })
            } else {
                this.goodsList.map(function (fn) {
                    fn.checked = false
                })
            }
        },
        checkOne: function () {
            let check = this.goodsList.every(function (fn) {
                if (fn.checked) {
                    return true
                }
                return false
            })
            if (check) {
                this.checkboxAll = true
            } else {
                this.checkboxAll = false
            }
        },
        getPage: function (index) {
            this.last_id = index
            getGoods()
        },

        changeGoodsState: function (id, nowState) {
            let state = ''
            if (nowState == 0) {
                state = 1
            } else if (nowState == 1) {
                state = 0
            } else {
                state = 2
            }
            let id_list = []
            id_list[0] = id
            id_list = JSON.stringify(id_list)
            updateGoodsState(id_list, state)
        },

        showMoreParam: function (id) {
            this.goodsList.map(function (res) {
                if (res.id == id) {
                    res.showMoreParam = !res.showMoreParam
                }
                return res
            })
        },
        // 下架
        showObtainedModal: function () {
            $('#obtained').addClass('inline-block')
        },
        hideObtainedModal: function () {
            $('#obtained').removeClass('inline-block')
        },
        // 批量分类用
        haveCategoryParent: function (id) {
            let type = 1, parent_id = id
            this.category_id_select = ''
            getCategory(type, parent_id)
        },
        submitCategoty: function () {
            if (!this.category_parent_id_select) {
                alert('请选择要改变的分类')
                return
            }
            if (!this.category_id_select) {
                alert('请选择要改变的分类')
                return
            }
            // 待更新分类名单
            let updateGoodsCategoryList = this.goodsList.filter(function (fn) {
                return fn.checked
            }).map(function (fn) {
                return fn.id
            })
            if (updateGoodsCategoryList.length <= 0) {
                alert('请选择需改变分类的商品')
                return
            }
            updateGoodsCategoryList = JSON.stringify(updateGoodsCategoryList)
            updateGoodsCategory(updateGoodsCategoryList, this.category_id_select)
        },
        // 批量改价
        showPriceModal: function () {
            this.previewGoodsPrice = this.goodsList.filter(function (fn) {
                fn.price_latest = ''
                fn.price_max = ''
                fn.price_max_latest = ''
                let temp = Number(fn.price)
                for (let i in fn.param) {
                    fn.param[i].price_latest = ''
                    if (temp < Number(fn.param[i].price)) {
                        temp = Number(fn.param[i].price).toFixed(2)
                    }
                }
                fn.price_max = temp
                return fn.checked
            })
            console.info(this.previewGoodsPrice)
        },
        submitPrice: function () {
            if ((this.choose_type == 1 && !this.calc_number_one) || (this.choose_type == 2 && !this.calc_number_two)) {
                alert('请设置要更改的价格')
                return
            }
            let checkPrice = this.previewGoodsPrice.every(function (fn) {
                if (fn.price_latest < 0) {
                    return false
                }
                return true
            })
            if (!checkPrice) {
                alert('更改后的价格不能为负数')
                return
            }
            let updateGoodsPriceList = []
            for (let i in this.previewGoodsPrice) {
                updateGoodsPriceList.push({
                    id: this.previewGoodsPrice[i].id,
                    param: this.previewGoodsPrice[i].param,
                    price: this.previewGoodsPrice[i].price_latest
                })
            }
            updateGoodsPrice(updateGoodsPriceList)
        },
        // 批量下架
        submitObtained: function () {
            // 待下架名单
            let updateGoodsObtainedList = this.goodsList.filter(function (fn) {
                return fn.checked
            }).map(function (fn) {
                return fn.id
            })
            if (updateGoodsObtainedList.length <= 0) {
                alert('请选择需下架的商品')
                return
            }
            updateGoodsObtainedList = JSON.stringify(updateGoodsObtainedList)
            // 1下架 0上架
            updateGoodsState(updateGoodsObtainedList, 1)
            $('#obtained').removeClass('inline-block')
        },

        // 导出到excel start
        down: function (tableid) {
            if (getExplorer() == 'ie') {
                var curTbl = document.getElementById(tableid);
                var oXL = new ActiveXObject("Excel.Application");
                var oWB = oXL.Workbooks.Add();
                var xlsheet = oWB.Worksheets(1);
                var sel = document.body.createTextRange();
                sel.moveToElementText(curTbl);
                sel.select();
                sel.execCommand("Copy");
                xlsheet.Paste();
                oXL.Visible = true;

                try {
                    var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
                } catch (e) {
                    print("Nested catch caught " + e);
                } finally {
                    oWB.SaveAs(fname);
                    oWB.Close(savechanges = false);
                    oXL.Quit();
                    oXL = null;
                    idTmr = window.setInterval("Cleanup();", 1);
                }

            } else {
                tableToExcel(tableid)
            }
        },
        // 导出到excel end
    },
    watch: {
        calc_number_one: function (val) {
            if (this.choose_type == 1) {
                this.previewGoodsPrice.map(function (fn) {
                    if (val) {
                        fn.price_latest = Number(val).toFixed(2)
                        fn.price_max_latest = Number(val).toFixed(2)
                        for (let i in fn.param) {
                            fn.param[i].price_latest = val
                        }
                    } else {
                        fn.price_latest = ''
                        fn.price_max_latest = ''
                        for (let i in fn.param) {
                            fn.param[i].price_latest = ''
                        }
                    }
                })
            }
        },
        calc_number_two: function (val) {
            let self = this
            if (this.choose_type == 2) {
                this.previewGoodsPrice.map(function (fn) {
                    if (val) {
                        if (self.calc_type == 1) {
                            fn.price_latest = Number(Number(fn.price) + Number(val)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) + Number(val)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) + Number(val))
                            }
                        } else if (self.calc_type == 2) {
                            fn.price_latest = Number(Number(fn.price) - Number(val)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) - Number(val)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) - Number(val))
                            }
                        } else if (self.calc_type == 3) {
                            fn.price_latest = Number(Number(fn.price) * Number(val)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) * Number(val)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) * Number(val))
                            }
                        } else if (self.calc_type == 4) {
                            fn.price_latest = Number(Number(fn.price) / Number(val)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) / Number(val)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) / Number(val))
                            }
                        }
                    } else {
                        fn.price_latest = ''
                        fn.price_max_latest = ''
                        for (let i in fn.param) {
                            fn.param[i].price_latest = ''
                        }
                    }
                })
            }
        },
        choose_type: function (val) {
            let self = this
            // 修改方式
            if (val == 1) {
                this.previewGoodsPrice.map(function (fn) {
                    if (self.calc_number_one) {
                        fn.price_latest = Number(self.calc_number_one).toFixed(2)
                        fn.price_max_latest = Number(self.calc_number_one).toFixed(2)
                        for (let i in fn.param) {
                            fn.param[i].price_latest = self.calc_number_one
                        }
                    } else {
                        fn.price_latest = ''
                        fn.price_max_latest = ''
                        for (let i in fn.param) {
                            fn.param[i].price_latest = ''
                        }
                    }
                })
            } else if (val == 2) {
                this.previewGoodsPrice.map(function (fn) {
                    if (self.calc_number_two) {
                        if (self.calc_type == 1) {
                            fn.price_latest = Number(Number(fn.price) + Number(self.calc_number_two)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) + Number(self.calc_number_two)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) + Number(self.calc_number_two))
                            }
                        } else if (self.calc_type == 2) {
                            fn.price_latest = Number(Number(fn.price) - Number(self.calc_number_two)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) - Number(self.calc_number_two)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) - Number(self.calc_number_two))
                            }
                        } else if (self.calc_type == 3) {
                            fn.price_latest = Number(Number(fn.price) * Number(self.calc_number_two)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) * Number(self.calc_number_two)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) * Number(self.calc_number_two))
                            }
                        } else if (self.calc_type == 4) {
                            fn.price_latest = Number(Number(fn.mini_price) / Number(self.calc_number_two)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) / Number(self.calc_number_two)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) / Number(self.calc_number_two))
                            }
                        }
                    } else {
                        fn.price_latest = ''
                        fn.price_max_latest = ''
                        for (let i in fn.param) {
                            fn.param[i].price_latest = ''
                        }
                    }
                })
            }
        },
        calc_type: function (val) {
            let self = this
            if (this.choose_type == 2) {
                this.previewGoodsPrice.map(function (fn) {
                    if (self.calc_number_two) {
                        if (val == 1) {
                            fn.price_latest = Number(Number(fn.price) + Number(self.calc_number_two)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) + Number(self.calc_number_two)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) + Number(self.calc_number_two))
                            }
                        } else if (val == 2) {
                            fn.price_latest = Number(Number(fn.price) - Number(self.calc_number_two)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) - Number(self.calc_number_two)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) - Number(self.calc_number_two))
                            }
                        } else if (val == 3) {
                            fn.price_latest = Number(Number(fn.price) * Number(self.calc_number_two)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) * Number(self.calc_number_two)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) * Number(self.calc_number_two))
                            }
                        } else if (val == 4) {
                            fn.price_latest = Number(Number(fn.price) / Number(self.calc_number_two)).toFixed(2)
                            fn.price_max_latest = Number(Number(fn.price_max) / Number(self.calc_number_two)).toFixed(2)
                            for (let i in fn.param) {
                                fn.param[i].price_latest = Number(Number(fn.param[i].price) / Number(self.calc_number_two))
                            }
                        }
                    } else {
                        fn.price_latest = ''
                        fn.price_max_latest = ''
                        for (let i in fn.param) {
                            fn.param[i].price_latest = ''
                        }
                    }
                })
            }
        }
    }
})

function updateGoods(id) {
    const url = api.updateGoodsValue, async = true
    let data = goodsVM.goodsList.filter((item)=>{
        return item.id == id
    })[0]
    console.info(data)
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.text == '更新成功') {
            getGoods()
        }
    })
    // const url = api.updateGoodsValue, async = true
    // let data = {}
    // data.goods_id = id
    // data.value = value
    // data.type = type
    // server(url, data, async, "post", function (res) {
    //     // console.info(res)
    //     if (res.text == '更新成功') {
    //         getGoods()
    //     }
    // })
}

function updateGoodsState(id_list, state) {
    const url = api.updateGoodsState, async = true
    let data = {}
    data.goods_id_list = id_list
    data.state = state
    console.info(data)
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res == '更新商品状态成功') {
            getGoods()
        }
    })
}

$(document).ready(function () {
    goodsVM.user_type = sessionStorage.getItem('type')
    getGoods()
    getCategory(0, 0)

    // $("#calc_number").bind("input propertychange",function(event){
    //     //     console.info($("#calc_number").val())
    //     // });
})

function getGoods() {
    goodsVM.pageList = []
    goodsVM.goodsList = []
    // -1全部 / 0出售中 / 1出售完 / 2已下架
    let url = api.getGoods, async = true
    let data = {}
    data.last_id = goodsVM.last_id
    data.state = goodsVM.goods_state
    data.need_integral = goodsVM.need_integral
    if (goodsVM.user_type == 1) {
        data.cate = sessionStorage.getItem('cate')
        // data.brand = sessionStorage.getItem('brand')
        url = api.getGoodsByCate
    }
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.number > 0) {
            res.list = res.list.map(function (resData) {
                resData.price = Number(resData.price).toFixed(2)
                resData.create_time = formatTime(new Date(resData.create_time))
                // resData.showMoreParam = false
                // let total_stock = 0
                // for (let i in resData.param) {
                //     total_stock = total_stock + resData.param[i].stock
                //     resData.param[i].price = Number(resData.param[i].price).toFixed(2)
                // }
                // resData.total_stock = total_stock
                resData.checked = false
                return resData
            })
            // console.info(res)
            goodsVM.goodsList = res.list

            // 分页栏
            for (let i = 0; i < res.number / 5; i++) {
                goodsVM.pageList.push(i + 1)
            }
        }
    })
}

// 批量分类
function getCategory(type, parent_id) {
    const url = api.getCategory, async = true
    let data = {}
    data.type = type
    data.parent_id = parent_id
    server(url, data, async, "post", function (res) {
        // console.info(res)
        // if (res.length > 0) {
        if (type == 0) {
            goodsVM.category_parent = res
        } else if (type == 1) {
            goodsVM.category = res
        }
        // }
    })
}

function updateGoodsCategory(goods_id_list, category_id) {
    const url = api.updateGoodsCategory, async = true
    let data = {}
    data.goods_id_list = goods_id_list
    data.category_id = category_id
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.text == '编辑成功') {
            getGoods()
            // getCategory(0, 0)
            $('input[name = "checkbox-all"]')[0].checked = false
            $('#categoryModal').modal('hide')
        }
    })
}

function updateGoodsPrice(goods_list) {
    const url = api.updateGoodsPrice, async = true
    let data = {}
    data.goods_list = goods_list
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.text == '编辑成功') {
            getGoods()
            goodsVM.checkboxAll = false
            goodsVM.choose_type = 1
            goodsVM.calc_type = 1
            goodsVM.calc_number_one = ''
            goodsVM.calc_number_two = ''
            goodsVM.previewGoodsPrice = []
            $('input[name = "checkbox-all"]')[0].checked = false
            $('#priceModal').modal('hide')
        }
    })
}


// 导出excel start
// 判断浏览器
var idTmr;

function getExplorer() {
    var explorer = window.navigator.userAgent;
//ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
//firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
//Chrome
    else if (explorer.indexOf("Chrome") >= 0) {
        return 'Chrome';
    }
//Opera
    else if (explorer.indexOf("Opera") >= 0) {
        return 'Opera';
    }
//Safari
    else if (explorer.indexOf("Safari") >= 0) {
        return 'Safari';
    }
}

function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}

var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
        base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g,
                function (m, p) {
                    return c[p];
                })
        }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
    }
})()
// 导出excel end