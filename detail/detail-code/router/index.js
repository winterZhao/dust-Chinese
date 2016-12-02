

const router = require('koa-router')();

const data = require('./data.js');

module.exports = function(app) {

//起步
    // intro
    router.get('/start/index1',function*(){
        yield this.render('index1.dust', {
            data: data.data1
        });
    });

    // dot_notation
    router.get('/start/index2',function*(){
        yield this.render('index2.dust', {
            data: data.data2
        });
    });

    // if例子（conditional）
    router.get('/start/index3',function*(){
        yield this.render('index3.dust', {
            data: data.data3,
            expectedData: data.data31
        });
    });

    // if/else 例子(else)
    router.get('/start/index4',function*(){
        yield this.render('index4.dust', {
            data: data.data4,
            expectedData: data.data41
        });
    });

    // 块体 (section)
    router.get('/start/index5',function*(){
        yield this.render('index5.dust', {
            data: data.data5,
            expectedData: data.data5
        });
    });

    // 查找上下文 (reference_lookup)
    router.get('/start/index6',function*(){
        yield this.render('index6.dust', {
            data: data.data6,
            expectedData: data.data6
        });
    });

    // 循环 (loop)
    router.get('/start/index7',function*(){
        yield this.render('index7.dust', {
            data: data.data7,
            expectedData: data.data7
        });
    });

    // 循环上下文,数组嵌套对象(loop_references)
    router.get('/start/index8',function*(){
        yield this.render('index8.dust', {
            data: data.data8,
            expectedData: data.data8
        });
    });

// 上下文 Context;
    // 在父级查找(search-upwards)
    router.get('/context1',function*(){
        yield this.render('context1.dust', {
            data: data.contextData1
        });
    });

    // 增加删除上下文(push)
    router.get('/context2',function*(){
        yield this.render('context2.dust', {
            data: data.contextData2
        });
    });


    // 全局上下文(global)
    router.get('/context3',function*(){
        yield this.render('context3.dust', {
            data: data.contextData3
        });
    });


    // 检测应用(monitor-app);
    router.get('/context-helper1',function*(){
        yield this.render('context-helper1.dust', {
            data: data.contextHelper1
        });
    });

//Dust-helpers
    // 逻辑帮助函数(helpers_logic);
    router.get('/dust-helper1',function*(){
        yield this.render('dust-helper1.dust', {
            data: data.dustHelper1
        });
    });

    // 逻辑帮助函数的else(helpers_else)
    router.get('/dust-helper2',function*(){
        yield this.render('dust-helper2.dust', {
            data: data.dustHelper2
        });
    });

    // 逻辑帮助函数的casting(helpers_casting)
    router.get('/dust-helper3',function*(){
        yield this.render('dust-helper3.dust', {
            data: data.dustHelper3
        });
    });

    // 分隔符选择器(grammatical-correctness)
    router.get('/dust-helper4',function*(){
        yield this.render('dust-helper4.dust', {
            data: data.dustHelper4
        });
    });

    // 选择符选择器(helpers_select)
    router.get('/dust-helper5',function*(){
        yield this.render('dust-helper5.dust', {
            data: data.dustHelper5
        });
    });

    // 数学选择器(helpers_math)
    router.get('/dust-helper6',function*(){
        yield this.render('dust-helper6.dust', {
            data: data.dustHelper6
        });
    });

    // 输出数学选择器运算结果(helpers_math_output)
    router.get('/dust-helper7',function*(){
        yield this.render('dust-helper7.dust', {
            data: data.dustHelper7
        });
    });

    // 调试(helpers_contextdump)
    router.get('/dust-helper8',function*(){
        yield this.render('dust-helper8.dust', {
            data: data.dustHelper8
        });
    });

// 局部模板(partials)

    router.get('/partial',function*(){
        yield this.render('partial1.dust', {
            data: data.partialData
        });
    });

// 块级和行内模板(base_template)
    router.get('/block-inline-partial',function*(){
        yield this.render('block-inline-partial.dust', {
            data: {}
        });
    });

// 子模板(child_template)
    router.get('/block-inline-partial2',function*(){
        yield this.render('block-inline-partial2.dust', {
            data: {}
        });
    });

//语法
    // 引用(reference)
    router.get('/syntax1',function*(){
        yield this.render('syntax1.dust', {
            data: data.syntaxData1
        });
    });

    // 注释(comments)
    router.get('/syntax2',function*(){
        yield this.render('syntax2.dust', {
            data: {}
        });
    });

    // 块体上下文(section)
    router.get('/syntax3',function*(){
        yield this.render('syntax3.dust', {
            data: data.syntaxData3
        });
    });

    // 判断存在的块体上下文(exists)
    router.get('/syntax4',function*(){
        yield this.render('syntax4.dust', {
            data: data.syntaxData4
        });
    });

    // 判断不存在的块体上下文(exists)
    router.get('/syntax5',function*(){
        yield this.render('syntax5.dust', {
            data: data.syntaxData5
        });
    });

    // 帮助函数(@helper)
    router.get('/syntax6',function*(){
        yield this.render('syntax6.dust', {
            data: data.syntaxData6
        });
    });

    // 行内局部模板(inline_partial)
    router.get('/syntax7',function*(){
        yield this.render('syntax7.dust', {
            data: {}
        });
    });

    // 局部模板(inline_partial)
    router.get('/syntax8',function*(){
        yield this.render('syntax8.dust', {
            data1: data.syntaxData8
        });
    });

    // 特殊符号(special)
    router.get('/syntax9',function*(){
        yield this.render('syntax9.dust', {
            data: {}
        });
    });

    // 使用过滤器 Using FIlters
    router.get('/filters',function*(){
        yield this.render('filter.dust', {
            data: data.syntaxData1
        });
    });


    app.use(router.routes())
        .use(router.allowedMethods());
};
