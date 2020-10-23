var storeVM = new Vue({
    el: '#store',
    data: {
        storeList: [],
        id: '',
        name: '',
        machine_code: '',
        location: '',
        phone: '',
        delivery_fee: 0,
        free_delivery_fee: 0,
        distance: 0,
        start_time: '',
        end_time: '',
        type: 0,
        // last_id: 0,

        // pageList: [], // 分页栏
    },
    methods: {
        // getPage: function (index) {
        //     this.last_id = index
        //     getUser()
        // },
        toAddStore: function () {
            this.type = 0
            this.name = ''
            this.machine_code = ''
            this.location = ''
            this.phone = ''
            this.delivery_fee = ''
            this.free_delivery_fee = ''
            this.distance = ''
            this.start_time = ''
            this.end_time = ''
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('添加店址')
            })
        },
        toUpdateStore: function (id) {
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('修改店信息')
            })
            this.type = 1
            for (let i in this.storeList) {
                if (this.storeList[i].id == id) {
                    this.id = this.storeList[i].id
                    this.name = this.storeList[i].name
                    this.machine_code = this.storeList[i].machine_code
                    this.location = this.storeList[i].location
                    this.phone = this.storeList[i].phone
                    this.delivery_fee = this.storeList[i].delivery_fee
                    this.free_delivery_fee = this.storeList[i].free_delivery_fee
                    this.distance = this.storeList[i].distance
                    this.start_time = this.storeList[i].start_time
                    this.end_time = this.storeList[i].end_time
                    break
                }
            }
        },
        toDelStore: function (id) {
            delStore(id)
        },
        submitStoreLocation: function () {
            if (this.name == "") {
                alert("请填写点名")
                return
            }
            if (this.location == "") {
                alert("请填写坐标")
                return
            }
            if (this.phone == "") {
                alert("请填写客服电话")
                return
            }
            if (this.delivery_fee < 0) {
                alert("请填写配送费")
                return
            }
            if (this.free_delivery_fee < 0) {
                alert("请填写免配送费额度")
                return
            }
            if (this.distance < 0) {
                alert("请填写配送距离")
                return
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
            if (this.type == 0) addStore(); else updateStore()
        }
    }
})

$(document).ready(function () {
    getStore()
})

function getStore() {
    const url = api.getStore, async = true
    let data = {}
    data.last_id = storeVM.last_id
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.length > 0) {
            res = res.map((eData) => {
                eData.create_time = formatTime(new Date(eData.create_time))
                return eData
            })
            storeVM.storeList = res
        }

    })
}

function addStore() {
    const url = api.addStore, async = true
    let data = {}
    data.name = storeVM.name
    data.machine_code = storeVM.machine_code
    data.location = storeVM.location
    data.phone = storeVM.phone
    data.delivery_fee = storeVM.delivery_fee
    data.free_delivery_fee = storeVM.free_delivery_fee
    data.distance = storeVM.distance
    data.start_time = storeVM.start_time
    data.end_time = storeVM.end_time
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.code) {
            window.location.reload()
        }
    })
}

function updateStore() {
    const url = api.updateStore, async = true
    let data = {}
    data.id = storeVM.id
    data.name = storeVM.name
    data.machine_code = storeVM.machine_code
    data.location = storeVM.location
    data.phone = storeVM.phone
    data.delivery_fee = storeVM.delivery_fee
    data.free_delivery_fee = storeVM.free_delivery_fee
    data.distance = storeVM.distance
    data.start_time = storeVM.start_time
    data.end_time = storeVM.end_time
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.code) {
            window.location.reload()
        }
    })
}

function delStore(id) {
    const url = api.delStore, async = true
    let data = {}
    data.id = id
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.code) {
            window.location.reload()
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
