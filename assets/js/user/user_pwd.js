$(function () {
    const { form,layer } = layui;

    // 为密码框分别添加对应的校验规则
    form.verify({
        // 校验规则 要添加到html结构中 lay-verify=" |后面"
        pwd: [/^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    $('.layui-form').on('submit',function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功!')
                // 重置 表单 (将jq元素转换成DOM元素 用DOM方法重置 .reset())
                $('.layui-form')[0].reset();// jq元素后面 + [0]就是转换成DOM元素
            }
        })
    })
})