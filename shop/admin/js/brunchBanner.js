var brunchBannerVM = new Vue({
    el: '#brunchBanner',
    data: {
        bannerList: [],
        navList: ['启用项', '禁用项'],
        navId: 0,
        last_id: 0,

        pageList: [], // 分页栏

        del_id: '',
    },
    methods: {
        // editBrand: function (brand_id) {
        //     let temp = this.brandList.filter(function (res) {
        //         return res.id == brand_id
        //     })
        //     sessionStorage.setItem("editBrand", JSON.stringify(temp));
        //     window.location.href = "editBrand"
        // },
        // 删除按钮弹窗
        delItem: function (index) {
            const body = this.bannerList[index].name
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('删除')
                modal.find('.modal-body span').text('是否删除 "' + body + '" 删除后不可恢复')
            })
            this.del_id = this.bannerList[index].id
        },
        getPage: function (index) {
            this.last_id = index
            getBrunchBanner()
        },
        changeNav: function (index) {
            this.navId = index
            this.last_id = 0
            getBrunchBanner()
        },
        changeStatus: function (id, status) {
            // 0展示 1关闭
            let cstate = (status == 0 ? 1 : 0)
            // if (status == 0) {
            //     cstate = 1
            // } else if (status == 1) {
            //     cstate = 0
            // }
            changeBrandStatus(id, cstate)
        },
    }
})

$(document).ready(function () {
    getBrunchBanner()
})

function getBrunchBanner() {
    brunchBannerVM.pageList = []
    brunchBannerVM.bannerList = []
    const url = api.getBrunchBanner, async = true
    let data = {}
    data.last_id = brunchBannerVM.last_id
    data.status = brunchBannerVM.navId
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.number > 0) {
            res.bannerList.map(function (fn) {
                fn.create_time = formatTime(new Date(fn.create_time))
                return fn
            })
            brunchBannerVM.bannerList = res.bannerList

            // 分页栏
            for (let i = 0; i < res.number / 4; i++) {
                brunchBannerVM.pageList.push(i + 1)
            }
        }
    })
}

function delBrunchBanner() {
    console.info(brunchBannerVM.del_id)
    const url = api.delBrunchBanner, async = true
    let data = {}
    data.del_id = brunchBannerVM.del_id
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.code == 0) {
            $('#myModal').modal('hide')
            getBrunchBanner()
        }
    })
}

function changeBrandStatus(id, status) {
    const url = api.updateBrunchBannerStatus, async = true
    let data = {}
    data.id = id
    data.status = status
    server(url, data, async, "post", function (res) {
        if (res.code == 0) {
            // brunchBannerVM.last_id = 0
            getBrunchBanner()
        }
    })
}

function updateSort(id, sort) {
    const url = api.updateBrunchBannerSort, async = true
    let data = {}
    data.id = id
    data.sort = sort
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.code == 0) {
            getBrunchBanner()
        }
    })
}