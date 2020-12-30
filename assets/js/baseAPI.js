// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候， 
// 会先调用 ajaxPrefilter 这个函数 
// 在这个函数中，可以拿到我们给Ajax提供的配置对象 
$.ajaxPrefilter(function(options) { 
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径 
    options.url = 'http://ajax.frontend.itheima.net' + options.url 
// options是函数自带的内置对象
// options对象 包括accepts、crossDomain、contentType、url、async、type、headers、error、dataType等许多参数选项
    if (options.url.indexOf('/my/') !== -1) {// 统一为有权限的接口，设置 headers 请求头
        options.headers = {
            // 用户认证
            Authorization: localStorage.getItem('token') ||''
        }
    }

    options.compplete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.status === '身份验证失败') {
            // 清空本地数据 token
            localStorage.removeItem('token')
            // 然后强制跳转 登录注册页面
            location.href = '/login.html'
        }
    }
})
