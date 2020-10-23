var addPositionVM = new Vue({
    el: '#addPosition',
    data: {
        position_name: '',
        position_desc: '',

        goods_manage: false,
        order_manage: false,
        order_update_price: false,
        order_refund: false,
        order_other: false,
        info_manage: false,
        user_manage: false,
    },
    methods: {
        // 商品提交
        submit: function (state) {
            // state 1 保存并继续添加 0 保存
            if (this.position_name == '') {
                alert('请填写岗位名称')
                return
            }
            if (this.position_desc == '') {
                alert('请填写岗位描述')
                return
            }
            if (!this.goods_manage && !this.order_update_price && !this.order_refund && !this.order_other && !this.info_manage && !this.user_manage) {
                alert('请至少选择一个权限')
                return
            }
            // addPosition(state)
        },
    },
    watch: {
        order_update_price: function (val) {
            if (val && this.order_refund == true && this.order_other == true) {
                this.order_manage = true
            }
            if (!val) {
                this.order_manage = false
            }
        },
        order_refund: function (val) {
            if (val && this.order_update_price == true && this.order_other == true) {
                this.order_manage = true
            }
            if (!val) {
                this.order_manage = false
            }
        },
        order_other: function (val) {
            if (val && this.order_update_price == true && this.order_refund == true) {
                this.order_manage = true
            }
            if (!val) {
                this.order_manage = false
            }
        }
    }
})

$(function () {
    $('#orderManage').click(function () {
        if ($('input[name="orderManage"]').prop("checked")) {
            // 选中
            addPositionVM.order_update_price = true
            addPositionVM.order_refund = true
            addPositionVM.order_other = true
        } else {
            // 未选中
            addPositionVM.order_update_price = false
            addPositionVM.order_refund = false
            addPositionVM.order_other = false
        }
    });
})

function addPosition(state) {
    // state 1 保存并继续添加 0 保存
    const url = '../api/add_position'
    let data = {}
    data.user_id = sessionStorage.getItem('user_id')
    data.name = addPositionVM.position_name
    data.desc = addPositionVM.position_desc
    data.goods_manage = Number(!addPositionVM.goods_manage)
    data.order_manage = Number(!addPositionVM.order_manage)
    data.info_manage = Number(!addPositionVM.info_manage)
    data.user_manage = Number(!addPositionVM.user_manage)
    data.order_update_price = Number(!addPositionVM.order_update_price)
    data.order_refund = Number(!addPositionVM.order_refund)
    data.order_other = Number(!addPositionVM.order_other)
    console.info(data)
    server(url, data, "post", function (res) {
        if (res.text == '添加成功') {
            alert('添加成功')
            if (state == 1) {
                location.reload()
            } else {
                addPositionVM.changePage('account')
            }
        }
    })
}