$(function () {
    // 点击去注册按钮
    $('#link_reg').on('click', () => {
        $('.login-box').hide();
        $('.reg-box').show();
    });


    // 点击去登录按钮
    $('#link_login').on('click', () => {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    // 从 layui 中获取 form 对象 只要导入了layui.js 就有layui变量 自然就有form

    const {form,layer} = layui; // 对象解构

    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则 
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'], 
        // 校验两次密码是否一致的规则 
        repwd: function(value) { // repwd 在哪 value 就是谁的值
            // 通过形参拿到的是确认密码框中的内容 
            // 还需要拿到密码框中的内容 
            // 然后进行一次判断 
            // 如果判断失败,则return一个提示消息即可 
            var pwd = $('.reg-box [name=password]').val() 
            if (pwd !== value) { 
                return '两次密码不一致！' 
            } 
        }
    })

    // 监听注册表单提交事件 提交数据
    $('#form_reg').on('submit',function (e) {
        // 1.先阻止默认提交行为 手动提交 不阻止 页面会自动刷新
        e.preventDefault()

        // 2. 提交数据
        $.ajax({
            method:"POST",
            url:'/api/reguser',
            data:{
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success:(res) => {
                if (res.status !== 0) {
                    layer.msg(res.message || '注册失败');
                    return;
                }
                layer.msg(res.message || '注册成功');
                // 手动点击去登录 自动跳转
                $('#link_login').click();
            }
        })
    })

    // 监听登录表单提交事件
    $('#form_login').on('submit',function (e) {
        // 阻止默认提交
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:$(this).serialize(),
            success:function (res) {
                if (res.status !== 0) {
                    // layer.msg 是 layui里面的内置 提示框
                    layer.msg(res.message);
                    return;
                }
                layer.msg('登陆成功');
                localStorage.setItem('token',res.token);
                location.href = "/index.html";
            }
        })
    })


})