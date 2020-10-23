var waterfallVM = new Vue({
    el: '#waterfall',
    data: {
        watList: [],
        // navList: ['瀑布流', '专题精选', '待展示商品' , '限时抢购'],
        navList: ['瀑布流', '专题精选', '待展示商品'],
        navId: 0,
        last_id: 0,

        // stateList: ['开启', '关闭'],
        // stateId: 0,

        pageList: [], // 分页栏
        searchString: "",
    },
    methods: {
        // 跳转添加瀑布流需要
        changePage: function (e) {
            var href = './' + e + '.html'
            $("#container").load(href);
            sessionStorage.setItem("href", href);
        },
        // 删除按钮弹窗
        delItem: function (index) {
            const body = this.watList[index].name
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('删除')
                modal.find('.modal-body span').text('是否删除 "' + body + '" 删除后不可恢复')
            })
        },
        // 状态按钮
        changeStatus: function (itemId, type) {
            // console.info(itemId)
            // console.info(type)
            changeWaterFallState(itemId, type)
        },
        getPage: function (index) {
            this.last_id = index
            getWaterFall()
        },
        changeNav: function (index) {
            this.navId = index
            this.last_id = 0
            getWaterFall()
        },
        updateSort: function (id, sort) {
            updateWaterFallSort(id, sort)
        },
        searchGoods: function () {
            let self = this
            this.pageList = []
            this.watList = []
            const url = api.getWaterfallBySearch, async = true
            let data = {}
            data.searchString = this.searchString
            data.type = this.navId
            server(url, data, async, "post", function (res) {
                res.list.map(function (fn) {
                    fn.create_time = formatTime(new Date(fn.create_time))
                    return fn
                })
                self.watList = res.list
            })
        }
    }
})

$(document).ready(function () {
    getWaterFall()
})

function getWaterFall() {
    waterfallVM.pageList = []
    waterfallVM.watList = []
    const url = api.getWaterfall, async = true
    let data = {}
    data.last_id = waterfallVM.last_id
    data.type = waterfallVM.navId
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.number > 0) {
            res.list.map(function (fn) {
                fn.create_time = formatTime(new Date(fn.create_time))
                return fn
            })
            waterfallVM.watList = res.list

            // 分页栏
            for (let i = 0; i < res.number / 5; i++) {
                waterfallVM.pageList.push(i + 1)
            }
        }
    })
}

function changeWaterFallState(itemId, type) {
    const url = api.updateWaterfall, async = true
    let data = {}
    data.id = itemId
    data.type = type
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.text == "更改成功") {
            location.reload()
        }
    })
}

function updateWaterFallSort(id, sort) {
    const url = api.updateWaterfallSort, async = true
    let data = {}
    data.id = id
    data.sort = sort
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.code == 0) {
            // location.reload()
            getWaterFall()
        }
    })
}