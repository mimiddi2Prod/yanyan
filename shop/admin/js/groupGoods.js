var groupVM = new Vue({
    el: '#group',
    data: {
        goodsList: [],
        navList: ['正在团购', '已确认团购', '添加团购'],
        navId: 0,
        last_id: 0,
        addGroupBuyId: 0,

        pageList: [], // 分页栏
        // goodsRefund: {},
    },
    methods: {
        // 跳转添加推荐位需要
        // changePage: function (e) {
        //     var href = './' + e + '.html'
        //     $("#container").load(href);
        //     sessionStorage.setItem("href", href);
        // },
        changePage: function (e, goods_id) {
            // if (e == 'goods-edit') {
            //     let temp = this.goodsList.filter(function (res) {
            //         return res.id == goods_id
            //     })
            //     sessionStorage.setItem("editGoodsList", JSON.stringify(temp));
            // }
            if (e == 'goods-group-refund') {
                let temp = this.goodsList.filter(function (res) {
                    return res.id == goods_id
                })
                let info = {}
                // console.info(temp)
                info.item_id = temp[0].id
                info.name = temp[0].name
                info.image = temp[0].image[0]
                sessionStorage.setItem("goods_group_refund", JSON.stringify(info));
            }
            var href = './' + e + '.html'
            $("#container").load(href);
            sessionStorage.setItem("href", href);
        },
        changeGoodsState: function (id, nowState) {
            let state = ''
            if (nowState == 0) {
                state = 1
            } else if (nowState == 1) {
                state = 0
            }
            let id_list = []
            id_list[0] = id
            id_list = JSON.stringify(id_list)
            updateGoodsState(id_list, state)
        },
        getPage: function (index) {
            this.last_id = index
            getGroup()
        },
        changeNav: function (index) {
            this.navId = index
            this.last_id = 0
            getGroup()
        },
        showMoreParam: function (id) {
            this.goodsList.map(function (res) {
                if (res.id == id) {
                    res.showMoreParam = !res.showMoreParam
                }
                return res
            })
        },
        changeStatus: function (id, state) {
            // 0在首页展示 1不在首页展示
            let cstate = ''
            if (state == 0) {
                cstate = 1
            } else if (state == 1) {
                cstate = 0
            }
            changeBrandState(id, cstate)
        },
        isFounded: function (type, id) {
            let founded = type
            updateGroupState(id, founded)
        },
        addGroupBuy: function (id) {
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('添加团购')
            })
            this.addGroupBuyId = id
        },
        checkAddGroupBuy: function () {
            let start_time = new Date(document.getElementById('start_time').value).getTime()
            let end_time = new Date(document.getElementById('end_time').value).getTime()
            let current_time = new Date().getTime()
            if (!end_time || !start_time) {
                alert('请选择正确的时间')
                return false
            } else if (start_time < current_time) {
                alert('团购开始时间不得早于当前时间')
                return false
            } else if (end_time < current_time) {
                alert('团购结束时间不得早于当前时间')
                return false
            } else if (end_time < start_time) {
                alert('团购开始时间不得晚于结束时间')
                return false
            }
            addGroupBuy(this.addGroupBuyId, start_time, end_time)
            $('#myModal').modal('hide')
        }
    }
})

// 时间控件
laydate.render({
    elem: '#start_time'
    , type: 'datetime'
    , calendar: true
});

laydate.render({
    elem: '#end_time'
    , type: 'datetime'
    , calendar: true
});

$(document).ready(function () {
    getGroup()
})

function getGroup() {
    groupVM.pageList = []
    groupVM.goodsList = []
    const url = '../api/get_group', async = true
    let data = {}
    data.last_id = groupVM.last_id
    data.state = groupVM.navId
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.number > 0) {
            res.list = res.list.map(function (resData) {
                resData.price = Number(resData.price).toFixed(2)
                resData.create_time = formatTime(new Date(resData.create_time))
                resData.start_time = formatTime(new Date(resData.start_time))
                resData.end_time = formatTime(new Date(resData.end_time))
                resData.showMoreParam = false
                let total_stock = 0
                for (let i in resData.param) {
                    total_stock = total_stock + resData.param[i].stock
                    resData.param[i].price = Number(resData.param[i].price).toFixed(2)
                }
                resData.total_stock = total_stock
                resData.checked = false
                return resData
            })
            // console.info(res)
            groupVM.goodsList = res.list

            // 分页栏
            for (let i = 0; i < res.number / 5; i++) {
                groupVM.pageList.push(i + 1)
            }
        }
    })
}

function updateGoodsState(id_list, state) {
    const url = '../api/update_goodsState', async = true
    let data = {}
    data.goods_id_list = id_list
    data.state = state
    // console.info(data)
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res == '更新商品状态成功') {
            getGroup()
        }
    })
}

function updateGroupState(id, founded) {
    const url = '../api/update_groupState', async = true
    let data = {}
    data.id = id
    data.founded = founded
    // console.info(data)
    // let temp = groupVM.goodsList.filter(function (res) {
    //     return res.id == id
    // })
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.text == '更新团购状态成功') {
            if (founded == -1) {
                // 跳转到退款列表
                // console.info(id)
                // groupVM.goodsRefund = temp
                groupVM.changePage('goods-group-refund', id)
            } else {
                getGroup()
            }
        }
    })
}

// function toRefund(id){
//     console.info(id)
//     location.href = 1
// }

function addGroupBuy(id, start_time, end_time) {
    const url = '../api/add_groupBuy', async = true
    let data = {}
    data.id = id
    data.end_time = end_time
    data.start_time = start_time
    data.user_id = sessionStorage.getItem('user_id')
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.text == '添加成功') {
            getGroup()
        }
    })
}