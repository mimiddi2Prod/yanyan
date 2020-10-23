var panicBuyVM = new Vue({
    el: '#panicBuy',
    data: {
        watList: [],
        navList: [{
            text: '可设置列表',
            id: 0
        }],
        navId: 0,
        nav_panic_buying_time_id: 0,
        last_id: 0,

        pageList: [], // 分页栏

        id: '', // 更新 删除 的id
        weekList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        submitWeek: [],
        start_time: '',
        end_time: '',

        submitType: 0, // 0增加 1更新
        // 展示
        // 抢购时间
        panic_buying_time: [],

        slcTime: '',

        searchString: '',
    },
    methods: {
        searchGoods: function () {
            let self = this
            self.pageList = []
            self.watList = []
            const url = api.getPanicBuyingBySearch, async = true
            let data = {}
            // data.last_id = this.last_id
            data.searchString = this.searchString
            data.panic_buying_time_id = this.nav_panic_buying_time_id
            server(url, data, async, "post", function (res) {
                console.info(res)
                if (res.list.length > 0) {
                    let interval = setInterval(function () {
                        if (panicBuyVM.panic_buying_time.length > 0) {
                            res.list.map(function (fn) {
                                // fn.create_time = formatTime(new Date(fn.create_time))
                                if (fn.panic_buying_price) {
                                    fn.panicPrice = fn.panic_buying_price
                                }
                                fn.pTime = panicBuyVM.panic_buying_time
                                return fn
                            })
                            self.watList = res.list

                            // 分页栏
                            // for (let i = 0; i < res.number / 5; i++) {
                            //     panicBuyVM.pageList.push(i + 1)
                            // }
                            clearInterval(interval)
                        }
                    }, 500)

                }
            })
        },
        toAddTime: function () {
            this.submitType = 0
            this.start_time = ''
            this.end_time = ''
            let weekCheckBox = document.getElementsByName('weekCheckbox')
            this.submitWeek = []
            for (let i in weekCheckBox) {
                weekCheckBox[i].checked = false
            }
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('添加限时抢购时段')
            })
        },
        submitTime: function () {
            let weekCheckBox = document.getElementsByName('weekCheckbox')
            this.submitWeek = []
            for (let i in weekCheckBox) {
                if (weekCheckBox[i].checked) {
                    this.submitWeek.push(Number(i) + 1)
                }
            }
            this.start_time = document.getElementById('test5_1').value
            this.end_time = document.getElementById('test5_2').value
            if (this.start_time == "") {
                alert("请选择营业开始时间")
                return
            }
            if (this.end_time == "") {
                alert("请选择营业结束时间")
                return
            }
            if (this.start_time > this.end_time) {
                alert("营业开始时间不得大于结束时间")
                return
            }

            if (this.submitType == 0) {
                addPanicBuyingTime()
            } else {
                updatePanicBuyingTime()
            }

        },
        updateTime: function (id) {
            this.submitType = 1
            this.id = id
            let info = this.panic_buying_time.filter(function (e) {
                return e.id == id
            })[0]
            this.start_time = info.start_time
            this.end_time = info.end_time
            let weekCheckBox = document.getElementsByName('weekCheckbox')
            for (let i in weekCheckBox) {
                weekCheckBox[i].checked = false
            }
            for (let i = 1; i <= 7; i++) {
                for (let j in info.week) {
                    if (info.week[j] == i) {
                        weekCheckBox[i - 1].checked = true
                    }
                }
            }
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('更新限时抢购时段')
            })
        },
        delTime: function (id) {
            this.id = id
            $('#myModalDel').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('#titleDel').text('删除')
            })
        },
        changeNav: function (index, id) {
            this.navId = index
            this.last_id = 0
            this.nav_panic_buying_time_id = id
            getPanicBuying()
        },
        updateSort: function (id, sort) {
            updateWaterFallSort(id, sort)
        },
        getPage: function (index) {
            this.last_id = index
            getPanicBuying()
        },
        getTime: function (id) {
            console.info(id)
        },
        addToPanicBuying: function (id) {
            let panic = this.watList.filter(function (e) {
                return e.id == id
            })[0]
            if (panic.panicTime && Number(panic.panicPrice)) {
                if (this.nav_panic_buying_time_id == 0) {
                    addPanicBuying(panic)
                } else {
                    updatePanicBuying(panic)
                }
            } else {
                alert('请选择时段，并填写正确的抢购价')
            }
        },
        delPanicBuying: function (id, panic_buying_id) {
            const url = api.delPanicBuying, async = true
            let data = {}
            data.item_id = id
            data.pbid = panic_buying_id
            server(url, data, async, "post", function (res) {
                window.location.reload()
            })
        }
        // changeNav: function (index, tag) {
        //     if (tag == 'time') {
        //         this.navId = index
        //         this.last_id = 0
        //         getWaterFall()
        //     } else {
        //         this.navId = index
        //         this.last_id = 0
        //         getWaterFall()
        //     }
        //
        // }
        // 删除按钮弹窗
        // delItem: function (index) {
        //     const body = this.watList[index].name
        //     $('#myModal').on('show.bs.modal', function () {
        //         var modal = $(this)
        //         modal.find('.modal-title').text('删除')
        //         modal.find('.modal-body span').text('是否删除 "' + body + '" 删除后不可恢复')
        //     })
        // },
        // 状态按钮
        // changeStatus: function (itemId, type) {
        //     // console.info(itemId)
        //     // console.info(type)
        //     changeWaterFallState(itemId, type)
        // },

        // changeNav: function (index) {
        //     this.navId = index
        //     this.last_id = 0
        //     getWaterFall()
        // },
        // updateSort: function (id, sort) {
        //     updateWaterFallSort(id, sort)
        // },
    }
})

$(document).ready(function () {
    // getWaterFall()
    getPanicBuyingTime()
    getPanicBuying()
})

// function getWaterFall() {
//     panicBuyVM.pageList = []
//     panicBuyVM.watList = []
//     const url = api.getWaterfall, async = true
//     let data = {}
//     data.last_id = panicBuyVM.last_id
//     data.type = panicBuyVM.navId
//     server(url, data, async, "post", function (res) {
//         // console.info(res)
//         if (res.number > 0) {
//             res.list.map(function (fn) {
//                 fn.create_time = formatTime(new Date(fn.create_time))
//                 return fn
//             })
//             panicBuyVM.watList = res.list
//
//             // 分页栏
//             for (let i = 0; i < res.number / 5; i++) {
//                 panicBuyVM.pageList.push(i + 1)
//             }
//         }
//     })
// }

// function changeWaterFallState(itemId, type) {
//     const url = api.updateWaterfall, async = true
//     let data = {}
//     data.id = itemId
//     data.type = type
//     server(url, data, async, "post", function (res) {
//         // console.info(res)
//         if (res.text == "更改成功") {
//             location.reload()
//         }
//     })
// }

// function updateWaterFallSort(id, sort) {
//     const url = api.updateWaterfallSort, async = true
//     let data = {}
//     data.id = id
//     data.sort = sort
//     server(url, data, async, "post", function (res) {
//         console.info(res)
//         if (res.code == 0) {
//             // location.reload()
//             getWaterFall()
//         }
//     })
// }
function getPanicBuyingTime() {
    // panicBuyVM.navList = ['可设置列表']
    panicBuyVM.navList = [{
        text: '可设置列表',
        id: 0
    }]
    const url = api.getPanicBuyingTime, async = true
    let data = {}
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.length > 0) {
            panicBuyVM.panic_buying_time = res.map(function (e) {
                panicBuyVM.navList.push({
                    text: e.start_time + '~' + e.end_time,
                    id: e.id
                })
                e.week = JSON.parse(e.week)
                return e
            })
        }
    })
}

function addPanicBuyingTime() {
    const url = api.addPanicBuyingTime, async = true
    let data = {}
    data.week = JSON.stringify(panicBuyVM.submitWeek)
    data.start_time = panicBuyVM.start_time
    data.end_time = panicBuyVM.end_time
    data.user_id = sessionStorage.getItem('user_id')
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.text == "添加成功") {
            location.reload()
        }
    })
}

function updatePanicBuyingTime() {
    const url = api.updatePanicBuyingTime, async = true
    let data = {}
    data.id = panicBuyVM.id
    data.week = JSON.stringify(panicBuyVM.submitWeek)
    data.start_time = panicBuyVM.start_time
    data.end_time = panicBuyVM.end_time
    data.user_id = sessionStorage.getItem('user_id')
    // console.info(data)
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.text == "编辑成功") {
            location.reload()
        }
    })
}

function delTime() {
    const url = api.DelPanicBuyingTime, async = true
    let data = {}
    data.id = panicBuyVM.id
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.text == "删除成功") {
            location.reload()
        }
    })
}

function getPanicBuying() {
    panicBuyVM.pageList = []
    panicBuyVM.watList = []
    const url = api.getPanicBuying, async = true
    let data = {}
    data.last_id = panicBuyVM.last_id
    data.panic_buying_time_id = panicBuyVM.nav_panic_buying_time_id
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.number > 0) {
            let interval = setInterval(function () {
                if (panicBuyVM.panic_buying_time.length > 0) {
                    res.list.map(function (fn) {
                        // fn.create_time = formatTime(new Date(fn.create_time))
                        if (fn.panic_buying_price) {
                            fn.panicPrice = fn.panic_buying_price
                        }
                        fn.pTime = panicBuyVM.panic_buying_time
                        return fn
                    })
                    panicBuyVM.watList = res.list

                    // 分页栏
                    for (let i = 0; i < res.number / 5; i++) {
                        panicBuyVM.pageList.push(i + 1)
                    }
                    clearInterval(interval)
                }
            }, 500)

        }
    })
}

function updateWaterFallSort(id, sort) {
    const url = api.updateWaterfallSort, async = true
    let data = {}
    data.id = id
    data.sort = sort
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.code == 0) {
            location.reload()
        }
    })
}

function addPanicBuying(panic) {
    const url = api.addPanicBuying, async = true
    let data = {}
    data.panic_buying_time_id = panic.panicTime
    data.item_id = panic.id
    data.panic_buying_price = Number(panic.panicPrice)
    data.user_id = sessionStorage.getItem('user_id')
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.code == 1) {
            location.reload()
        }
    })
}

function updatePanicBuying(panic) {
    console.info(panic)
    const url = api.updatePanicBuying, async = true
    let data = {}
    data.panic_buying_time_id = panic.panicTime
    data.item_id = panic.id
    data.panic_buying_price = Number(panic.panicPrice)
    data.user_id = sessionStorage.getItem('user_id')
    data.panic_buying_id = panic.panic_buying_id
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.code == 1) {
            location.reload()
        }
    })
}

laydate.render({
    elem: '#test5_1'
    , type: 'time'
    , calendar: true
});

laydate.render({
    elem: '#test5_2'
    , type: 'time'
    , calendar: true
});