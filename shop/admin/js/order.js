var orderVM = new Vue({
    el: '#order',
    data: {
        navList: ['全部', '待发货', '待付款', '待送达', '退款|售后', '已完成', '已关闭'],
        // navId -1全部拉取 0待支付 1待发货 2已发货 3退款|售后 4已完成 5已关闭
        navId: -1,

        orderList: [],
        pageList: [],
        last_id: 0,

        logistics_type: '',
        logistics_order_id: '',
        logistics_code: '',
        logistics_tel: '', //顺丰快递查询还需要电话号码 后四位 格式-> 单号:号码后四位

        select_1: '商品ID',
        id_or_goodsName: '',
        start_time: '',
        end_time: '',
        select_2: '订单编号',
        tradeId_or_logistics: '',
        select_3: ['全部', '待发货', '待付款', '已发货', '已完成', '已关闭'],
        order_status: 0, //
        select_4: '收货人姓名',
        userName_or_phone: '',
        select_5: ['暂不选择', '退款中+退款成功', '退款中', '退款成功'],
        afterSale_status: 0,

        voiceVM: voiceVM,

        /**
         * 订单显示·改
         */
        tradeList: [],
    },
    methods: {
        updateRemindTime: function () {
            const url = api.updateRemindTime, async = true
            let data = {}
            server(url, data, async, "post", function (res) {
                // console.info(res)
                document.getElementById("audio").pause()
            })
        },
        // changePage: function (e, id) {
        //     var href = './' + e + '.html'
        //     $("#container").load(href);
        //
        //     sessionStorage.setItem("href", href);
        //     sessionStorage.setItem("orderId", id);
        // },
        orderDetail: function (id) {
            sessionStorage.setItem("orderId", id);
            window.location.href = 'orderDetail'
        },
        getPage: function (index) {
            this.last_id = index
            getOrder()
        },
        changeNav: function (index) {
            this.navId = index - 1
            this.last_id = 0
            getOrder()
        },
        updateOrderState: function (order_id, state) {
            const url = api.updateOrderState, async = true
            let data = {}
            data.order_id = order_id
            data.state = state
            server(url, data, async, "post", function (res) {
                // console.info(res)
                if (res == "更新订单成功") {
                    getOrder()
                }
            })
        },
        getLogistics: function (order_id, tel) {
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('请填写快递运输单号')
            })
            this.logistics_order_id = order_id
            this.logistics_tel = tel
        },
        submitLogisticsCode: function () {
            if (!this.logistics_type) {
                alert("请选择快递类型")
                return
            }
            if (!this.logistics_code) {
                alert('请填写运输单号')
                return
            }
            const url = api.addLogisticsCodeToOrder, async = true
            let data = {}, self = this
            data.logistics_order_id = this.logistics_order_id
            if (this.logistics_type == "顺丰") {
                data.logistics_code = this.logistics_code + ':' + this.logistics_tel.substring(this.logistics_tel.length - 4)
            } else {
                data.logistics_code = this.logistics_code
            }
            server(url, data, async, "post", function (res) {
                // console.info(res)
                if (res.text == "添加运输单号成功") {
                    $('#myModal').modal('hide')
                    self.updateOrderState(self.logistics_order_id, 2)
                }
            })
        },
        reviewGoods: function (trade_id) {
            // let temp = this.goodsList.filter(function (eData) {
            //     return eData.id == goods_id
            // })
            // let info = {}
            // info.item_id = temp[0].id
            // info.name = temp[0].name
            // info.image = temp[0].image[0]
            // info.review_id = temp[0].review_id
            if (trade_id) {
                let info = {
                    trade_id: trade_id
                }
                sessionStorage.setItem("reviewGoods", JSON.stringify(info));
            } else {
                sessionStorage.removeItem("reviewGoods")
            }
            window.location.href = "reviewGoods"
        },
    }
})

laydate.render({
    elem: '#test5_1'
    , type: 'datetime'
    , calendar: true
});

laydate.render({
    elem: '#test5_2'
    , type: 'datetime'
    , calendar: true
});


function getOrder() {
    orderVM.pageList = []
    orderVM.orderList = []
    orderVM.tradeList = []
    const url = api.order, async = true
    let data = {}
    let state = orderVM.navId
    if (state == 0) {
        state = 1
    } else if (state == 1) {
        state = 0
    }
    data.state = state
    data.last_id = orderVM.last_id
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.number > 0) {
            if (res.tradeIdList) {
                res.tradeIdList = res.tradeIdList.map((item, index) => {
                    switch (index) {
                        case 0: {
                            item.background = "#92E4FA"
                            break
                        }
                        case 1: {
                            item.background = "#D5BDF1"
                            break
                        }
                        case 2: {
                            item.background = "#FBD0EE"
                            break
                        }
                        case 3: {
                            item.background = "#FECCD5"
                            break
                        }
                        case 4: {
                            item.background = "#F2F0BD"
                            break
                        }
                    }
                    return item
                })
            }

            res.list = res.list.map(function (data) {
                if (new Date() - new Date(data.create_time) < 60 * 60 * 1000) {
                    data.waitPay = true
                } else {
                    data.waitPay = false
                }

                data.create_time = formatTime(new Date(data.create_time))
                if (data.select_card_id) {
                    data.total_price_and_postage = Number((data.discount_price * data.number) + data.postage).toFixed(2)
                    data.total_price = Number(data.discount_price * data.number).toFixed(2)
                } else {
                    data.total_price_and_postage = Number((data.single_price * data.number) + data.postage).toFixed(2)
                    data.total_price = Number(data.single_price * data.number).toFixed(2)
                }

                data.single_price = Number(data.single_price).toFixed(2)
                data.postage = Number(data.postage).toFixed(2)

                data.background = '#fff'
                if (res.tradeIdList) {
                    for (let i in res.tradeIdList) {
                        if (res.tradeIdList[i].tradeId == data.tradeId) {
                            data.background = res.tradeIdList[i].background
                        }
                    }
                }

                return data
            })
            orderVM.orderList = res.list
            // 分页栏
            for (let i = 0; i < res.number / 5; i++) {
                orderVM.pageList.push(i + 1)
            }
            // console.info(orderVM.pageList)

            /**
             * 订单显示修改
             */
            if (res.tradeIdList) {
                orderVM.tradeList = res.tradeIdList.map(val => {
                    val.order = []
                    val.number = 0
                    val.total_price = 0
                    val.pay_method = ""
                    orderVM.orderList.forEach(m => {
                        if (val.tradeId == m.tradeId) {
                            val.postage = m.postage ? m.postage : 0
                            val.create_time = m.create_time
                            val.number += m.number
                            if (m.pay_state == 0) {
                                val.pay_method = "微信支付"
                            } else if (m.pay_state == 1) {
                                val.pay_method = "积分支付"
                            }

                            if (m.select_card_id) {
                                val.total_price += Math.round(m.discount_price * m.number * 100) / 100
                            } else {
                                val.total_price += Math.round(m.single_price * m.number * 100) / 100
                            }
                            val.user_id = m.user_id
                            val.order.push(m)
                        }
                    })
                    val.total_price_and_postage = Math.round((val.total_price + Number(val.postage)) * 100) / 100
                    return val
                })
            } else {
                orderVM.tradeList = []
            }

        }
        // console.info(res.list)
    })
}

$(document).ready(function () {
    let navId = sessionStorage.getItem('orderNav')
    console.info(navId)
    if (navId == 2 || navId == 3) {
        orderVM.navId = Number(navId)
    } else {
        orderVM.navId = -1
    }
    sessionStorage.removeItem('orderNav')
    getOrder()
})

// 筛选条件
function getOrderBySearch() {
    let start_time = document.getElementById('test5_1').value,
        end_time = document.getElementById('test5_2').value
    if (orderVM.id_or_goodsName.length <= 0 && !start_time && !end_time && orderVM.tradeId_or_logistics.length <= 0 && orderVM.userName_or_phone.length <= 0) {
        alert('请至少填写一项筛选条件！')
        return
    }
    if (start_time && !end_time) {
        alert('请选择截止时间')
        return
    }
    if (!start_time && end_time) {
        alert('请选择起始时间')
        return
    }
    if (new Date(start_time) > new Date(end_time)) {
        alert('起始时间不得大于截止时间')
        return
    }
    // console.info(start_time)
    // console.info(end_time)
    orderVM.pageList = []
    orderVM.orderList = []
    orderVM.navId = -1
    const url = api.getOrderBySearch, async = true
    let data = {}
    // data.last_id = orderVM.last_id
    data.select_1 = (orderVM.select_1 == '商品ID' ? 0 : 1)
    data.select_2 = (orderVM.select_2 == '订单编号' ? 0 : 1)
    data.order_status = orderVM.order_status
    data.select_4 = (orderVM.select_4 == '收货人姓名' ? 0 : 1)
    data.afterSale_status = orderVM.afterSale_status
    data.id_or_goodsName = orderVM.id_or_goodsName
    data.start_time = start_time
    data.end_time = end_time
    data.tradeId_or_logistics = orderVM.tradeId_or_logistics
    data.userName_or_phone = orderVM.userName_or_phone
    console.info(data)

    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.list && res.list.length > 0) {
            res.list = res.list.map(function (eData) {
                if (new Date() - new Date(eData.create_time) < 60 * 60 * 1000) {
                    eData.waitPay = true
                } else {
                    eData.waitPay = false
                }

                eData.create_time = formatTime(new Date(eData.create_time))
                eData.total_price_and_postage = Number((eData.single_price * eData.number) + eData.postage).toFixed(2)
                eData.single_price = Number(eData.single_price).toFixed(2)
                eData.postage = Number(eData.postage).toFixed(2)
                eData.background = '#fff'
                return eData
            })
            orderVM.orderList = res.list
        }
        // console.info(res.list)
    })
}
