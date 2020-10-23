var homeVM = new Vue({
    el: '#home',
    data: {
        todayOrder: 0,
        totalOrder: 0,

        waitShipNum: 0,
        afterSaleNum: 0,
        // sales: 0.00
        orderAmount: 0.00,
        orderBalanceAmount: 0.00,
        refundAmount: 0.00,

        dayList: [7, 30],
        active: 0,

        // 线性图参数
        data: [[], []],
        data_max: '', //Y轴最大刻度
        line_title: ["订单金额", "退款金额"], //曲线名称
        y_label: "单位 /元", //Y轴标题
        x_label: "日期", //X轴标题
        x: [], //定义X轴刻度值
        title: "这是标题", //统计图标标题

        people_total: 0,

        people_dayList: [7, 30],
        people_active: 0,
        people_data: [[], []],
        people_data_max: '', //Y轴最大刻度
        people_line_title: ["新增游客", "新增会员"], //曲线名称
        people_y_label: "单位 /人", //Y轴标题
        people_x_label: "日期", //X轴标题
        people_x: [], //定义X轴刻度值
        people_title: "这是标题", //统计图标标题


        people_shop_total: 0,

        people_shop_dayList: [7, 30],
        people_shop_active: 0,
        people_shop_data: [[], []],
        people_shop_data_max: '', //Y轴最大刻度
        // people_shop_line_title: ["新增游客", "新增会员"], //曲线名称
        people_shop_line_title: ["新增人数"], //曲线名称
        people_shop_y_label: "单位 /人", //Y轴标题
        people_shop_x_label: "日期", //X轴标题
        people_shop_x: [], //定义X轴刻度值
        people_shop_title: "这是标题", //统计图标标题


        // 第三表
        balance_total: 0,

        balance_dayList: [7, 30],
        balance_active: 0,
        balance_data: [[]],
        balance_data_max: '', //Y轴最大刻度
        // people_shop_line_title: ["新增游客", "新增会员"], //曲线名称
        balance_line_title: ["余额支付"], //曲线名称
        balance_y_label: "单位 /元", //Y轴标题
        balance_x_label: "日期", //X轴标题
        balance_x: [], //定义X轴刻度值
        balance_title: "这是标题", //统计图标标题
    },
    methods: {
        toOrder: function (nav) {
            if (nav.toString().length > 0) {
                sessionStorage.setItem("orderNav", nav);
                window.location.href = "order"
            }
        }
        // yinbaoGetGoodsToUpdate: function () {
        //     const url = '../api/yinbao_update_data', async = true
        //     let data = {}
        //     server(url, data, async, "post", function (res) {
        //         console.info(res)
        //         // editGoodsVM.category = res
        //     })
        // }
    }
})

$(document).ready(function () {
    getWaitShip()
    // getAfterSaleNumber()
    // getOrderAmount()
    // getRefundAmount()

    getSales(7)
    // getPeople(7)
    getPeopleShop(7)
    getBalanceShop(7)
})


function getWaitShip() {
    const url = api.getWaitShip, async = true
    let data = {}
    server(url, data, async, "post", function (res) {
        // console.info(res)
        homeVM.waitShipNum = res.deliveryNumber
        homeVM.afterSaleNum = res.afterSaleNumber
        homeVM.todayOrder = res.todayOrder
        homeVM.totalOrder = res.totalOrder
    })
}

// function getAfterSaleNumber() {
//     const url = api.getAfterSaleNumber, async = true
//     let data = {}
//     server(url, data, async, "post", function (res) {
//         // console.info(res)
//         homeVM.afterSaleNum = res.number
//     })
// }

function formate(time) {
    homeVM.x = []
    let current_time = new Date()
    let year = current_time.getFullYear(), month = current_time.getMonth() + 1, date = current_time.getDate()
    month = (month < 10 ? '0' + month : month)
    date = (date < 10 ? '0' + date : date)
    let timeParse = year + '-' + month + '-' + date
    let start_time = '', end_time = ''
    if (time == 7) {
        start_time = new Date(new Date(timeParse).getTime() - (6 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else if (time == 30) {
        start_time = new Date(new Date(timeParse).getTime() - (29 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else {
        start_time = new Date(document.getElementById('test5_1').value.slice(0, 10))
        end_time = new Date(document.getElementById('test5_2').value.slice(0, 10))
        if (!start_time) {
            alert('请选择起始时间')
            return
        }
        if (!end_time) {
            alert('请选择截止时间')
            return
        }
        if (new Date(start_time) > new Date(end_time)) {
            alert('起始时间不得大于截止时间')
            return
        }
    }

    start_time = start_time.getTime()
    end_time = end_time.getTime()
    for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
        let current = new Date(i)
        let x = (current.getMonth() + 1) + '-' + (current.getDate())
        homeVM.x.push(x)
    }

    homeVM.title = "订单与退款表" //统计图标标题
    self.writeChart()
}

function getSales(time) {
    homeVM.data = [[], []]
    let current_time = new Date()
    let year = current_time.getFullYear(), month = current_time.getMonth() + 1, date = current_time.getDate()
    month = (month < 10 ? '0' + month : month)
    date = (date < 10 ? '0' + date : date)
    let timeParse = year + '-' + month + '-' + date
    let start_time = '', end_time = ''
    if (time == 7) {
        homeVM.active = 0
        start_time = new Date(new Date(timeParse).getTime() - (6 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else if (time == 30) {
        homeVM.active = 1
        start_time = new Date(new Date(timeParse).getTime() - (29 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else {
        start_time = new Date(document.getElementById('test5_1').value.slice(0, 10))
        // end_time = new Date(document.getElementById('test5_2').value.slice(0, 10))
        end_time = new Date(document.getElementById('test5_2').value)
        if (!start_time) {
            alert('请选择起始时间')
            return
        }
        if (!end_time) {
            alert('请选择截止时间')
            return
        }
        if (new Date(start_time) > new Date(end_time)) {
            alert('起始时间不得大于截止时间')
            return
        }
        homeVM.active = 2
    }

    const url = api.getSales, async = true
    let data = {}
    data.start_time = new Date(new Date(start_time).getTime() - (24 * 60 * 60 * 1000))
    data.end_time = new Date(new Date(end_time).getTime())
    server(url, data, async, "post", function (res) {
        // console.info(res)
        // homeVM.sales = res.number
        homeVM.orderAmount = res.total_price
        homeVM.orderBalanceAmount = res.total_balance_price
        homeVM.refundAmount = res.total_refund
        // start_time = start_time.getTime() - (24 * 60 * 60 *1000)
        start_time = start_time.getTime()
        end_time = end_time.getTime()
        let max_number = 10
        // 本系统
        if (res.order) {
            for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
                let temp = 0
                for (let j in res.order) {
                    if (new Date(res.order[j].create_time).getTime() < (i + (24 * 60 * 60 * 1000)) && new Date(res.order[j].create_time).getTime() >= i) {
                        // temp = temp + (res.order[j].number * res.order[j].single_price).toFixed(2)
                        temp = (Number(temp) + Number(res.order[j].total_price)).toFixed(2)
                    }
                }
                // console.info(temp)
                max_number = temp > max_number ? Number(temp) + 1000 : max_number
                homeVM.data[0].push(temp)
            }
            homeVM.data_max = max_number
        }
        if (res.refund) {
            for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
                let temp = 0
                for (let j in res.refund) {
                    if (new Date(res.refund[j].create_time).getTime() < (i + (24 * 60 * 60 * 1000)) && new Date(res.refund[j].create_time).getTime() >= i) {
                        // temp = temp + (res.refund[j].number * res.refund[j].refund)
						temp = temp + res.refund[j].refund
                    }
                }
                max_number = Number(temp > max_number ? function () {
                    let len = parseInt(temp).toString().length
                    let pow = Math.pow(10, len - 1)
                    return Number((temp / pow)).toFixed(0) * pow + 2 * pow
                }() : max_number).toFixed(2)
                homeVM.data[1].push(temp)
            }
            homeVM.data_max = max_number
        } else {
            for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
                let temp = 0
                homeVM.data[1].push(temp)
            }
        }

        // 银豹退款
        // if (res.yinbaoRefund) {
        //     let k = 0
        //     for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
        //         let temp = 0
        //         for (let j in res.yinbaoRefund) {
        //             if (new Date(res.yinbaoRefund[j].time).getTime() < (i + (24 * 60 * 60 * 1000)) && new Date(res.yinbaoRefund[j].time).getTime() >= i) {
        //                 temp = temp + homeVM.data[1][k] + Number(res.yinbaoRefund[j].total_refund)
        //             }
        //         }
        //         max_number = temp > max_number ? function () {
        //             let len = parseInt(temp).toString().length
        //             let pow = Math.pow(10, len - 1)
        //             return Number((temp / pow)).toFixed(0) * pow + 2 * pow
        //         }() : max_number
        //         homeVM.data[1][k] = temp
        //         k++
        //     }
        //     homeVM.data_max = max_number
        // }

        // 银豹收银
        // if (res.order) {
        //     for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
        //         let temp = 0
        //         for (let j in res.order) {
        //             if (new Date(res.order[j].start_time).getTime() < (i + (24 * 60 * 60 * 1000)) && new Date(res.order[j].start_time).getTime() >= i) {
        //                 temp = temp + res.order[j].total_price
        //                 // console.info(temp)
        //             }
        //         }
        //         max_number = temp > max_number ? function () {
        //             let len = parseInt(temp).toString().length
        //             let pow = Math.pow(10, len - 1)
        //             return Number((temp / pow)).toFixed(0) * pow + 4 * pow
        //         }() : max_number
        //         homeVM.data[0].push(temp)
        //     }
        //     homeVM.data_max = max_number
        // } else {
        //     for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
        //         let temp = 0
        //         homeVM.data[0].push(temp)
        //     }
        // }

        self.formate(time)
    })
}

function getPeopleShop(time) {
    // homeVM.people_shop_data = [[], []]
    homeVM.people_shop_data = [[]]
    let current_time = new Date()
    let year = current_time.getFullYear(), month = current_time.getMonth() + 1, date = current_time.getDate()
    month = (month < 10 ? '0' + month : month)
    date = (date < 10 ? '0' + date : date)
    let timeParse = year + '-' + month + '-' + date
    let start_time = '', end_time = ''
    if (time == 7) {
        homeVM.people_shop_active = 0
        start_time = new Date(new Date(timeParse).getTime() - (6 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else if (time == 30) {
        homeVM.people_shop_active = 1
        start_time = new Date(new Date(timeParse).getTime() - (29 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else {
        start_time = new Date(document.getElementById('test5_13').value.slice(0, 10))
        // end_time = new Date(document.getElementById('test5_23').value.slice(0, 10))
        end_time = new Date(document.getElementById('test5_23').value)
        if (!start_time) {
            alert('请选择起始时间')
            return
        }
        if (!end_time) {
            alert('请选择截止时间')
            return
        }
        if (new Date(start_time) > new Date(end_time)) {
            alert('起始时间不得大于截止时间')
            return
        }
        homeVM.people_shop_active = 2
    }

    const url = api.getPeopleShop, async = true
    let data = {}
    data.start_time = start_time
    data.end_time = end_time
    server(url, data, async, "post", function (res) {
        homeVM.people_shop_total = res.total
        // console.info(res)
        // homeVM.sales = res.number
        start_time = start_time.getTime()
        end_time = end_time.getTime()
        let max_number = 10
        if (res.people) {
            for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
                let temp1 = 0, temp2 = 0
                for (let j in res.people) {
                    if (new Date(res.people[j].register_time).getTime() < (i + (24 * 60 * 60 * 1000)) && new Date(res.people[j].register_time).getTime() >= i) {
                        temp1++
                        // if (res.people[j].phone && res.people[j].phone.length > 0) {
                        //     temp2++
                        // }
                    }
                }
                max_number = temp1 > max_number ? function () {
                    let len = parseInt(temp1).toString().length
                    let pow = Math.pow(10, len - 1)
                    return Number((temp1 / pow)).toFixed(0) * pow + 2 * pow
                }() : max_number
                homeVM.people_shop_data[0].push(temp1)
                // homeVM.people_shop_data[1].push(temp2)
            }
            homeVM.people_shop_data_max = max_number
        } else {
            for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
                let temp = 0
                max_number = temp > max_number ? function () {
                    let len = parseInt(temp).toString().length
                    let pow = Math.pow(10, len - 1)
                    return Number((temp / pow)).toFixed(0) * pow + 2 * pow
                }() : max_number
                homeVM.people_shop_data[0].push(temp)
                // homeVM.people_shop_data[1].push(temp)
            }
            homeVM.people_shop_data_max = max_number
        }
        self.people_shop_formate(time)
    })
}

function people_shop_formate(time) {
    homeVM.people_shop_x = []
    let current_time = new Date()
    let year = current_time.getFullYear(), month = current_time.getMonth() + 1, date = current_time.getDate()
    month = (month < 10 ? '0' + month : month)
    date = (date < 10 ? '0' + date : date)
    let timeParse = year + '-' + month + '-' + date
    let start_time = '', end_time = ''
    if (time == 7) {
        start_time = new Date(new Date(timeParse).getTime() - (6 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else if (time == 30) {
        start_time = new Date(new Date(timeParse).getTime() - (29 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else {
        start_time = new Date(document.getElementById('test5_13').value.slice(0, 10))
        end_time = new Date(document.getElementById('test5_23').value.slice(0, 10))
        if (!start_time) {
            alert('请选择起始时间')
            return
        }
        if (!end_time) {
            alert('请选择截止时间')
            return
        }
        if (new Date(start_time) > new Date(end_time)) {
            alert('起始时间不得大于截止时间')
            return
        }
    }

    start_time = start_time.getTime()
    end_time = end_time.getTime()
    for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
        let current = new Date(i)
        let x = (current.getMonth() + 1) + '-' + (current.getDate())
        homeVM.people_shop_x.push(x)
    }

    homeVM.people_shop_title = "新增人数" //统计图标标题
    self.people_shop_writeChart()
}

function people_shop_writeChart() {
    var people_shop_data = homeVM.people_shop_data;
    var people_shop_data_max = homeVM.people_shop_data_max; //Y轴最大刻度
    var people_shop_line_title = homeVM.people_shop_line_title; //曲线名称
    var people_shop_y_label = homeVM.people_shop_y_label; //Y轴标题
    var people_shop_x_label = homeVM.people_shop_x_label; //X轴标题
    var people_shop_x = homeVM.people_shop_x; //定义X轴刻度值
    var people_shop_title = homeVM.people_shop_title; //统计图标标题

    if (document.getElementById('chart3')) {
        document.getElementById('chart_3').innerHTML = ''
    }
    var div = document.createElement("div");
    document.getElementById("chart_3").appendChild(div);
    div.id = 'chart3';

    j.jqplot.diagram.base("chart3", people_shop_data, people_shop_line_title, people_shop_title, people_shop_x, people_shop_x_label, people_shop_y_label, people_shop_data_max, 1);
}

function getOrderAmount() {
    const url = api.getOrderAmount, async = true
    let data = {}
    server(url, data, async, "post", function (res) {
        // console.info(res)
        homeVM.orderAmount = res.number
    })
}

function getRefundAmount() {
    const url = api.getRefundAmount, async = true
    let data = {}
    server(url, data, async, "post", function (res) {
        // console.info(res)
        homeVM.refundAmount = res.number
    })
}

function writeChart() {
    var data = homeVM.data;
    var data_max = homeVM.data_max; //Y轴最大刻度
    var line_title = homeVM.line_title; //曲线名称
    var y_label = homeVM.y_label; //Y轴标题
    var x_label = homeVM.x_label; //X轴标题
    var x = homeVM.x; //定义X轴刻度值
    var title = homeVM.title; //统计图标标题

    if (document.getElementById('chart1')) {
        document.getElementById('chart_1').innerHTML = ''
    }
    var div = document.createElement("div");
    document.getElementById("chart_1").appendChild(div);
    div.id = 'chart1';

    j.jqplot.diagram.base("chart1", data, line_title, title, x, x_label, y_label, data_max, 1);
}

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

laydate.render({
    elem: '#test5_13'
    , type: 'datetime'
    , calendar: true
});

laydate.render({
    elem: '#test5_23'
    , type: 'datetime'
    , calendar: true
});

laydate.render({
    elem: '#test5_15'
    , type: 'datetime'
    , calendar: true
});

laydate.render({
    elem: '#test5_25'
    , type: 'datetime'
    , calendar: true
});

function getBalanceShop(time) {
    homeVM.balance_data = [[]]
    let current_time = new Date()
    let year = current_time.getFullYear(), month = current_time.getMonth() + 1, date = current_time.getDate()
    month = (month < 10 ? '0' + month : month)
    date = (date < 10 ? '0' + date : date)
    let timeParse = year + '-' + month + '-' + date
    let start_time = '', end_time = ''
    if (time == 7) {
        homeVM.balance_active = 0
        start_time = new Date(new Date(timeParse).getTime() - (6 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else if (time == 30) {
        homeVM.balance_active = 1
        start_time = new Date(new Date(timeParse).getTime() - (29 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else {
        start_time = new Date(document.getElementById('test5_15').value.slice(0, 10))
        end_time = new Date(document.getElementById('test5_25').value)
        if (!start_time) {
            alert('请选择起始时间')
            return
        }
        if (!end_time) {
            alert('请选择截止时间')
            return
        }
        if (new Date(start_time) > new Date(end_time)) {
            alert('起始时间不得大于截止时间')
            return
        }
        homeVM.balance_active = 2
    }

    const url = api.getSalesBalance, async = true
    let data = {}
    data.start_time = new Date(new Date(start_time).getTime() - (24 * 60 * 60 * 1000))
    data.end_time = new Date(new Date(end_time).getTime())
    server(url, data, async, "post", function (res) {
        // homeVM.orderAmount = res.total_price
        // homeVM.orderBalanceAmount = res.total_balance_price
        // homeVM.refundAmount = res.total_refund
        start_time = start_time.getTime()
        end_time = end_time.getTime()
        let max_number = 10
        // 本系统
        if (res.order) {
            for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
                let temp = 0
                for (let j in res.order) {
                    if (new Date(res.order[j].create_time).getTime() < (i + (24 * 60 * 60 * 1000)) && new Date(res.order[j].create_time).getTime() >= i) {
                        // temp = temp + (res.order[j].number * res.order[j].single_price).toFixed(2)
                        temp = (Number(temp) + Number(res.order[j].total_price)).toFixed(2)
                    }
                }
                max_number = temp > max_number ? (Number(temp) + 1000).toFixed(2) : max_number
                homeVM.balance_data[0].push(temp)
            }
            homeVM.balance_data_max = max_number
        }
        // if (res.refund) {
        //     for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
        //         let temp = 0
        //         for (let j in res.refund) {
        //             if (new Date(res.refund[j].create_time).getTime() < (i + (24 * 60 * 60 * 1000)) && new Date(res.refund[j].create_time).getTime() >= i) {
        //                 temp = temp + res.refund[j].refund
        //             }
        //         }
        //         max_number = Number(temp > max_number ? function () {
        //             let len = parseInt(temp).toString().length
        //             let pow = Math.pow(10, len - 1)
        //             return Number((temp / pow)).toFixed(0) * pow + 2 * pow
        //         }() : max_number).toFixed(2)
        //         homeVM.balance_data[1].push(temp)
        //     }
        //     homeVM.balance_data_max = max_number
        // } else {
        //     for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
        //         let temp = 0
        //         homeVM.balance_data[1].push(temp)
        //     }
        // }

        self.b_formate(time)
    })
}

function b_formate(time) {
    homeVM.balance_x = []
    let current_time = new Date()
    let year = current_time.getFullYear(), month = current_time.getMonth() + 1, date = current_time.getDate()
    month = (month < 10 ? '0' + month : month)
    date = (date < 10 ? '0' + date : date)
    let timeParse = year + '-' + month + '-' + date
    let start_time = '', end_time = ''
    if (time == 7) {
        start_time = new Date(new Date(timeParse).getTime() - (6 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else if (time == 30) {
        start_time = new Date(new Date(timeParse).getTime() - (29 * 24 * 60 * 60 * 1000))
        end_time = current_time
    } else {
        start_time = new Date(document.getElementById('test5_15').value.slice(0, 10))
        end_time = new Date(document.getElementById('test5_25').value.slice(0, 10))
        if (!start_time) {
            alert('请选择起始时间')
            return
        }
        if (!end_time) {
            alert('请选择截止时间')
            return
        }
        if (new Date(start_time) > new Date(end_time)) {
            alert('起始时间不得大于截止时间')
            return
        }
    }

    start_time = start_time.getTime()
    end_time = end_time.getTime()
    for (let i = start_time; i <= end_time; i = i + (24 * 60 * 60 * 1000)) {
        let current = new Date(i)
        let x = (current.getMonth() + 1) + '-' + (current.getDate())
        homeVM.balance_x.push(x)
    }

    homeVM.balance_title = "余额订单表" //统计图标标题
    self.b_writeChart()
}

function b_writeChart() {
    var data = homeVM.balance_data;
    var data_max = homeVM.balance_data_max; //Y轴最大刻度
    var line_title = homeVM.balance_line_title; //曲线名称
    var y_label = homeVM.balance_y_label; //Y轴标题
    var x_label = homeVM.balance_x_label; //X轴标题
    var x = homeVM.balance_x; //定义X轴刻度值
    var title = homeVM.balance_title; //统计图标标题

    if (document.getElementById('chart5')) {
        document.getElementById('chart_5').innerHTML = ''
    }
    var div = document.createElement("div");
    document.getElementById("chart_5").appendChild(div);
    div.id = 'chart5';

    j.jqplot.diagram.base("chart5", data, line_title, title, x, x_label, y_label, data_max, 1);
}