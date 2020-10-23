var orderDetailVM = new Vue({
    el: '#orderDetail',
    data: {
        navList: ['订单详情', '物流信息'],
        navId: 0,

        orderId: '',
        goods_id: '',
        orderDetail: {},
        logisticsCode: '',
        logisticsName: '',
        logistics: []
    },
    methods: {
        // changePage: function (e) {
        //     var href = './' + e + '.html'
        //     $("#container").load(href);
        //
        //     sessionStorage.setItem("href", href);
        // },
        refund: function () {
            toRefund()
        },
        rejectRefund: function () {
            toRejectRefund()
        },
        changeNav: function (index) {
            this.navId = index
            if (index == 1 && this.logistics.length <= 0 && this.logisticsCode) {
                getLogistics(this.logisticsCode)
            }
        },
        changeGoodsState: function () {
            const url = api.updateOrderAfterSaleState, async = true
            var data = {}
            data.order_id = orderDetailVM.orderId
            data.after_sale_state = 6
            // console.info(data)
            server(url, data, async, "post", function (res) {
                console.info(res)
                if (res.code == 0) {
                    // 售后完成
                    alert(res.text)
                    getOrderDetail()
                } else if (res.code == 1) {
                    // 售后未完成
                    alert(res.text)
                }
            })
        }
    }
})

function toRejectRefund() {
    const url = "../api/rejectRefund", async = true
    var data = {}
    data.order_id = orderDetailVM.orderId
    data.user_id = orderDetailVM.orderDetail.user_id
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.code == 0) {
            // 退款成功
            alert(res.text)
            getOrderDetail()
        } else if (res.code == 1) {
            // 退款失败
            alert(res.text)
        }
    })
}

function toRefund() {
    $('#myModal').modal('show');
    const url = "../api/refund", async = true
    var data = {}
    data.refund_fee = orderDetailVM.orderDetail.aftersale[0].refund
    data.tradeId = orderDetailVM.orderDetail.tradeId
    data.total_fee = orderDetailVM.orderDetail.total_price_and_postage
    data.order_id = orderDetailVM.orderDetail.id
    data.after_sale_state = orderDetailVM.orderDetail.after_sale_state
    server(url, data, async, "post", function (res) {
        // console.info(res)
        $('#myModal').modal('hide');
        if (res.code == 0) {
            // 退款成功
            alert(res.text)
            getOrderDetail()

            if (orderDetailVM.orderDetail.have_cost_integral == 0) {
                // 已经在后端更新积分了 不再在前端推送
                // cutIntegral(orderDetailVM.orderDetail.aftersale[0].refund, orderDetailVM.orderDetail.user_id)
            }
        } else if (res.code == 1) {
            // 退款失败
            alert(res.text)
        }
    })
}

// function cutIntegral(refund, user_id) {
//     // console.info(refund)
//     const url = '../api/update_integral', async = true
//     var data = {}
//     data.integral = parseFloat(refund)
//     data.user_id = user_id
//     data.state = 1 // 0 增加 1 减少
//     console.info(data)
//     server(url, data, async, "post", function (res) {
//         // console.info(res)
//     })
// }

function getOrderDetail() {
    const url = '../api/order_detail', async = true
    var data = {}
    data.order_id = orderDetailVM.orderId
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.length > 0) {
            res = res.map(function (data) {
                if (new Date() - new Date(data.create_time) < 60 * 60 * 1000) {
                    data.waitPay = true
                } else {
                    data.waitPay = false
                }
                data.create_time = formatTime(new Date(data.create_time))
                data.total_price = Number(data.single_price * data.number).toFixed(2)
                data.total_price_and_postage = Number((data.single_price * data.number) + data.postage).toFixed(2)
                data.single_price = Number(data.single_price).toFixed(2)
                data.postage = Number(data.postage).toFixed(2)
                if (data.aftersale.length > 0) {
                    data.aftersale[0].refund = Number(data.aftersale[0].refund).toFixed(2)
                    data.aftersale[0].description = decodeURIComponent(data.aftersale[0].description)
                }
                return data
            })
            orderDetailVM.orderDetail = res[0]
            orderDetailVM.logisticsCode = res[0].logistics_code
            orderDetailVM.goods_id = res[0].id
            // 分页栏
            // for (let i = 0; i < res.number / 5; i++) {
            //     orderDetailVM.pageList.push(i + 1)
            // }
            // console.info(orderDetailVM.pageList)
        }
        // console.info(res)
    })
}

function getLogistics(logistics_code) {
    const url = '../api/get_logistics', async = true
    var data = {}
    data.logistics_code = logistics_code
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.status == "0" && res.msg == "ok") {
            orderDetailVM.logisticsName = res.result.expName
            orderDetailVM.logistics = res.result.list
        }
    })
}

$(document).ready(function () {
    orderDetailVM.orderId = sessionStorage.getItem("orderId")
    getOrderDetail()
})
