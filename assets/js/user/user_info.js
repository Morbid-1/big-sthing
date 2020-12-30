$(function () {
    const {form ,layer} = layui; // 获取layui里面的表单和layer元素
    form.verify ({
        nickname : function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间'
            }
        }
    })
    
    initUserInfo(); // 先调用一下初始化


    // 初始化用户 的基本信息
    function initUserInfo() {
        // 获取用户的基本信息
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res);
                // 为表单快速赋值 form.val（）
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 重置表单的数据 将表单数据重新渲染到页面
    $('#btnReset').on('click',function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 再初始化用户的基本信息
        initUserInfo();
    })


    // 监听表单的提交事件
    $('.layui-form').on('submit',function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax 数据请求
        $.ajax({
            method: 'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),//serialize()获取当前表单的所有数据 
            success:function (res) {
                if (res.status !== 0) {
                    // layer.msg()  layui里面的提示框
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户成功！')
                // 调用父页面中的方法 重新渲染用户的头像和用户信息
                window.parent.getUserInfo();// index.js里面写的方法
            }
        })
    })
})
