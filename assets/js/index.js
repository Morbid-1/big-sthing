$(function () {
    getUserInfo(); // 调用获取用户基本信息


    $('#quit').on('click',function () {
        layer.confirm(
            '确定退出登录？',
            {icon: 3, title: "提示"},
            function (index) {
                // do something
                // 1.清空本地储存 token
                localStorage.removeItem('token');
                // 重新跳转到登录页面
                location.href = '/login.html';
                // 2.关闭 confirm 询问问题
                layer.close(index);
            }
        )
    })
});

// 封装 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        headers: {
            Authorization: localStorage.getItem('token')
        },
        success: function (res) {
            console.log(res);

            if (res.status !== 0) {
               layui.layer.msg(res.message);
                return;
            }

            renderAvatar(res.data); // 调用渲染头像函数
        },
        // 不论成功还是失败，都会调用 complete 回调函数
        complete: function (res) {
            // console.log('执行了 complete 回调');
            console.log(res);
            // responseJSON 数据返回信息 打印res可见  
            if (res.responseJSON.status === 1 && res.responseJSON.status === '身份验证失败'){
                // 1. 清空本地储存 token
                localStorage.removeItem('token');
                // 2.强制返回登录页面
                location.href = '/login.html'

            }
        }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1. 获取用户的名称 
    var name = user.nickname || user.username 
    // 2. 设置欢迎的文本 
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name) 
    // 3. 按需渲染用户的头像 
    if (user.user_pic !== null) { 
        // 3.1 渲染图片头像 
        $('.layui-nav-img') 
        .attr('src', user.user_pic) 
        .show() 
        $('.text-avatar').hide() 
    } else {
         // 3.2 渲染文本头像 
         $('.layui-nav-img').hide() 
         var first = name[0].toUpperCase() 
         $('.text-avatar') 
         .html(first) 
         .show() 
        }
}