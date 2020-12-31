$(function () {
    const { layer, form } = layui

    initArtCateList() // 先调用


    // 获取文章分类的列表 渲染到页面
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 使用模板引擎 template(模板id，要渲染的数据)
                var htmlStr = template('tpl-table', res)
                // 渲染到 tbody 中
                $('tbody').html(htmlStr)
            }
        })
    }

    var indexAdd = null
    // 给添加按钮 绑定点击事件
    $('#btnAdd').on('click', function () {
        // 弹层组件 - layui.layer
        indexAdd = layer.open({
            // 可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            type: 1, // 类型：Number，默认：0
            area: ['500px', '250px'],// 宽高
            title: '添加文章分类',
            // 在弹出层中渲染`form`表单结构
            content: $('#dialog-add').html() // 内容
        })
    })

    // 事件委托  为 form-add 表单绑定 submit 提交事件
    // 按钮不是写死的 所以用事件委托
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({// 提交数据
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),// 快速获取表单数据
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 成功就重新渲染页面
                initArtCateList()
                layer.msg('新增分类成功！')
                // 成功后关闭弹出层 layer.close(要关闭的索引号)
                // 索引号 就是 layer.open
                layer.close(indexAdd)
            }
        })
    })

    // 通过 **事件委派** 的形式，为 `btn-edit` 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 在展示弹出层之后，根据 `id` 的值发起请求获取文章分类的数据，并填充到表单中
        var id = $(this).attr('data-id');
        console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })


    // 通过 事件委派 的方式，给确认修改按钮绑定点击事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({ // 提交数据
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })


    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({ // 获取数据
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success:function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })
        })

    })
})