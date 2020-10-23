import ("./utils/http.js")
import ("./voiceReminder.js")
var menuVM = new Vue({
    el: '#menu',
    data: {
        menu: [],
        activeMenuTag: '',

        isPhone: false
    },
    methods: {
        getMenu: function () {
            let self = this
            let url = api.getMenu, data = {}, async = false
            data.type = sessionStorage.getItem('type')
            if (!data.type) {
                window.location.href = './'
                return
            }
            if (data.type == 1) {
                data.user_id = sessionStorage.getItem('user_id')
            }
            server(url, data, async, "post", function (res) {
                // console.info(res)
                self.menu = res.menu
            })
        },
    },
    created: function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            // 执行相应代码或直接跳转到手机页面
            this.isPhone = true
        } else {
            // 执行桌面端代码
            this.isPhone = false
        }

        this.getMenu()
        let href = window.location.href
        let arr = href.split('/')
        let tag = arr[arr.length - 1]
        if (tag == 'addGoods' || tag == 'editGoods') {
            tag = 'goods'
        }
        if (tag == 'addBrand' || tag == 'editBrand') {
            tag = 'brand'
        }
        if (tag == 'addRecommend' || tag == 'editRecommend') {
            tag = 'recommend'
        }
        if (tag == 'orderDetail' || tag == 'reviewGoods') {
            tag = 'order'
        }
        if (tag == 'addAccount' || tag == 'editAccount') {
            tag = 'account'
        }
        if (tag == 'addBrunchBanner') {
            tag = 'brunchBanner'
        }
        this.activeMenuTag = tag
    }
})

Vue.component('load-menu', {
    data: function () {
        return {
            menu: menuVM.menu,
            activeMenuTag: menuVM.activeMenuTag,
            isPhone: menuVM.isPhone,
            voiceVM: voiceVM
        }
    },
    // template: '<nav>' +
    //     '<ul class="nav">' +
    //     '<li v-for="item in menu" :class="(item.tag == activeMenuTag ? \'active \' : \'\')+\'\'+(item.subMenu.length > 0 ? \'noSelect\' : \'canSelect\')">' +
    //     '<div class="a-item" v-if="item.subMenu.length <= 0" v-on:click="window.location.href = item.tag">' +
    //     '<img class="menu-logo" :src="item.image"/>' +
    //     '<span class="a-span" :class="(item.subMenu.length > 0 ? \'\' : \'have-img\')">{{item.name}}</span>' +
    //     '</div>' +
    //     '<div class="a-item" v-if="item.subMenu.length > 0">' +
    //     '<img class="menu-logo" :src="item.image"/>' +
    //     '<span class="a-span" :class="(item.subMenu.length > 0 ? \'\' : \'have-img\')">{{item.name}}</span>' +
    //     '</div>' +
    //     '<ul class="nav" v-if="item.subMenu.length > 0">' +
    //     '<li v-for="subItem in item.subMenu" class="canSelect" v-on:click="window.location.href = subItem.tag" :class="(subItem.tag == activeMenuTag ? \'active \' : \'\')">' +
    //     '<div class="a-sub-item">' +
    //     '<span class="a-span">{{subItem.name}}</span>' +
    //     '</div>' +
    //     '</li></ul>' +
    //     '</li>' +
    //     '</ul></nav>'
    template: '<header class="nav-holder make-sticky">\n' +
        '    <div id="navbar" role="navigation" class="navbar" style="margin-bottom: 0">\n' +
        '        <div style="width:100%"><div style="display:flex;flex-direction:row-reverse;"><button type="button" data-toggle="collapse" data-target="#navigation"\n' +
        '                    class="navbar-toggler btn-template-outlined btn btn-secondary" :style="isPhone ? \'margin-top:20px;margin-bottom:10px;margin-right:20px\' : \'display:none\'">三</button></div>\n' +
        '<div id="navigation" class="navbar-collapse collapse" style="padding: 0">' +
        '<nav>' +
        '<ul class="nav">' +
        '<li v-for="item in menu" :class="(item.tag == activeMenuTag ? \'active \' : \'\')+\'\'+(item.subMenu.length > 0 ? \'noSelect\' : \'canSelect\')">' +
        '<div class="a-item" v-if="item.subMenu.length <= 0" v-on:click="window.location.href = item.tag">' +
        '<img class="menu-logo" :src="item.image"/>' +
        '<span class="a-span" :class="(item.subMenu.length > 0 ? \'\' : \'have-img\')">{{item.name}}<span v-if="voiceVM.voice && item.name == \'订单\'" style="color:red">{{\'(\'+(voiceVM.voice.deliveryNumber + voiceVM.voice.afterSaleNumber)+\')\'}}</span></span>' +
        '</div>' +
        '<div class="a-item" v-if="item.subMenu.length > 0">' +
        '<img class="menu-logo" :src="item.image"/>' +
        '<span class="a-span" :class="(item.subMenu.length > 0 ? \'\' : \'have-img\')">{{item.name}}</span>' +
        '</div>' +
        '<ul class="nav" v-if="item.subMenu.length > 0">' +
        '<li v-for="subItem in item.subMenu" class="canSelect" v-on:click="window.location.href = subItem.tag" :class="(subItem.tag == activeMenuTag ? \'active \' : \'\')">' +
        '<div class="a-sub-item">' +
        '<span class="a-span">{{subItem.name}}</span>' +
        '</div>' +
        '</li></ul>' +
        '</li>' +
        '</ul></nav>' +
        '</div>' +
        '        </div>\n' +
        '    </div>\n' +
        '</header>'
})

new Vue({el: '#LoadMenu'})