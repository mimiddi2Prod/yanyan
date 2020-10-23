var navigationVM = new Vue({
    el: '#navigations',
    data: {
        last_id: 0,
        // goryList: [{
        //     name: '在埃及与宿敌DIO的死斗之后过了11年。1999年，空条承太郎为了与祖父乔瑟夫·乔斯达的私生子东方仗助见面，而来到了日本M县S市杜王町。但，仗助却持有与承太郎相同的特殊能力“替身”。之后，以承太郎的来访为开端，仿佛被吸引一般，新的“替身使”们开始行动。“这座城镇存在着什么……”为了守护养育了自己的杜王町，仗助挺身而出——。',
        //     img: '/images/logo.png',
        //     order: 1,
        //     status: 0, //0:点击开启， 1:点击禁用
        // }, {
        //     name: '学生百搭披风潮流超人同款加长加厚',
        //     img: '/images/logo.png',
        //     order: 1,
        //     status: 1, //0:点击开启， 1:点击禁用
        // }],
        goryList: [],
        pageList: [], // 分页栏

        navList: ['首页导航', '添加导航'],
        navId: 0,
    },
    methods: {
        changePage: function (e) {
            var href = './' + e + '.html'
            $("#container").load(href);
            // console.info(href)
            sessionStorage.setItem("href", href);
        },
        delItem: function (index) {
            const body = this.goryList[index].name
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('删除')
                modal.find('.modal-body span').text('是否删除 "' + body + '" 删除后不可恢复')
            })
        },
        changeStatus: function (id, home_nav) {
            // 0在首页展示 1不在首页展示
            let state = ''
            if (home_nav == 0) {
                state = 1
            } else if (home_nav == 1) {
                state = 0
            }
            changeCategoryState(id, state)
        },
        getPage: function (index) {
            this.last_id = index
            getCategory()
        },
        changeNav: function (index) {
            this.navId = index
            this.last_id = 0
            getCategory()
        },
    }
})

$(document).ready(function () {
    getCategory()
})

function getCategory() {
    navigationVM.pageList = []
    navigationVM.goryList = []
    const url = api.getNavigation, async = true
    let data = {}
    data.last_id = navigationVM.last_id
    data.home_nav = navigationVM.navId
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.number > 0) {
            res.goryList.map(function (fn) {
                fn.create_time = formatTime(new Date(fn.create_time))
                return fn
            })
            navigationVM.goryList = res.goryList

            // 分页栏
            for (let i = 0; i < res.number / 5; i++) {
                navigationVM.pageList.push(i + 1)
            }
        }
    })
}

function changeCategoryState(id, state) {
    const url = api.updateNavigation, async = true
    let data = {}
    data.id = id
    data.home_nav = state
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.text == '更改成功') {
            navigationVM.last_id = 0
            getCategory()
        }
        // if (res.number > 0) {
        //     res.goryList.map(function (fn) {
        //         fn.create_time = formatTime(new Date(fn.create_time))
        //         return fn
        //     })
        //     navigationVM.goryList = res.goryList
        //
        //     // 分页栏
        //     for (let i = 0; i < res.number / 5; i++) {
        //         navigationVM.pageList.push(i + 1)
        //     }
        // }
    })
}