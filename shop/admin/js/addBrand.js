var addBrandVM = new Vue({
    el: '#addBrand',
    data: {
        imageList: [],
        name: '',
        desc: '',
        sort: '',
        price: '',
        urlList: ['/pages/brandDetail/brandDetail'],
        url_select: '',
    },
    methods: {
        // changePage: function (e) {
        //     var href = './' + e + '.html'
        //     $("#container").load(href);
        //     sessionStorage.setItem("href", href);
        // },
        getImg: function (id) {
            let imgUploadList = []
            const self = this, type = 'brand_'
            // 图片blob 用于上传
            // let imgFiles = document.getElementById(id).files  //多张图上传
            // 多张图上传
            // for (let i = 0; i < imgFiles.length; i++) {
            //     imgUploadList.push({
            //         key: '',
            //         tempFilePath: window.URL.createObjectURL(imgFiles[i]),
            //         uploadToken: '',
            //         imgFile: imgFiles[i]
            //     })
            // }
            // qiniuUpload(imgUploadList, type, function (res) {
            //     self.sortModalImg = self.sortModalImg.concat(res)
            // })
            //单张图上传
            let imgFile = document.getElementById(id).files[0]
            imgUploadList[0] = {
                key: '',
                tempFilePath: window.URL.createObjectURL(imgFile),
                uploadToken: '',
                imgFile: imgFile
            }
            qiniuUpload(imgUploadList, type, function (res) {
                self.imageList = res
            })
        },
        delImg: function (index) {
            this.imageList.splice(index, 1)
        },
        submit: function (state) {
            // console.info(state)
            // console.info(this.ad_type)
            // if (this.ad_type.length <= 0) {
            //     alert('请选择广告类型')
            //     return
            // }
            if (this.imageList.length <= 0) {
                alert('请添加品牌图片')
                return
            }
            if (this.name == '') {
                alert('请填写品牌名称')
                return
            }
            if (this.desc == '') {
                alert('请填写品牌介绍')
                return
            }
            if (this.price == '') {
                alert('请填写品牌价格')
                return
            }
            if (this.sort == '') {
                alert('请填写排序')
                return
            }
            if (this.url_select == '') {
                alert('请选择路径')
                return
            }
            // let imgUploadIsOkNum = 0
            // 全部验证完毕 开始上传图片 有图片的地方分别是 1.imgList 2.SortItem>size>img 3.goodsInfoImgList
            if (this.imageList.length > 0) {
                let self = this, flag = 0
                for (let i in this.imageList) {
                    uploadImg(this.imageList[i].key, this.imageList[i].uploadToken, this.imageList[i].imgFile, function (res) {
                        // flag 图片上传完毕之后才提交
                        flag++
                        if (flag == self.imageList.length) {
                            // console.info('上传完毕')
                            addBrand(state)
                            // imgUploadIsOkNum = imgUploadIsOkNum + 1
                        }
                    })
                }
            }
        }
    }
})

function addBrand(state) {
    const url = api.addBrand, async = true
    let data = {}
    data.state = state
    data.name = addBrandVM.name
    data.desc = addBrandVM.desc
    data.sort = addBrandVM.sort
    data.price = addBrandVM.price
    data.url = addBrandVM.url_select
    data.user_id = sessionStorage.getItem('user_id')
    // data.user_id = 0
    data.imgList = []
    for (let i in addBrandVM.imageList) {
        data.imgList.push(addBrandVM.imageList[i].key)
    }
    server(url, data, async, "post", function (res) {
        if (res.text == '添加成功') {
            alert('添加成功')
            location.reload()
        }
    })
}

$(document).ready(function () {

})


// laydate.render({
//   elem: '#test5'
//   ,type: 'datetime'
// });