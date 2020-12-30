$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)



    // 定义一个按钮，文本是 上传，一旦用户点击按钮
    $('#btnChooseImage').on('click', function () {
        // 我们手动触发 文件选择框的点击事件
        $('#file').click()
    })

    const { layer } = layui
    // 为文件选择框绑定 change 事件
    $('#file').on('click', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files
        console.log(filelist);
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }

        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
        // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 为确定按钮绑定 点击事件
    $('#btnUpload').on('click', function (e) {
        // 要拿到用户裁剪之后的头像
        // 创建一个 Canvas 画布，将 Canvas 画布上的内容，转化为 `base64` 格式的字符串
        // 减少不必要的网络请求 加快网页打开的速度
        // 比普通的图片大 30% 左右
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')


        // 调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo() // 调用index.js里面的方法 
            }
        })
    })
})