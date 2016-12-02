## Dust.js

###安装

请参照 安装。
**注**: node端推荐同时安装`dustjs-linkedin`和`dustjs-helpers`

### 渲染

        // koa
        yield this.render('xx.dust', {
            data1: data
        })

### 语法

1. 注释 {! 注释内容 !}

2. 渲染JSON数据，以{}为标志
    // 模板
    {name}
    {#hobbies}
     {.}
    {/hobbies}
    {#eat}
     {.breakfast}
    {/eat}

    // data
    {
       'name': 'zhangsan',
       'age': 23,
       'hobbies': ['足球', '篮球', '乒乓球'],
       'eat': {
           'breakfast': '八点',
           'lunch': '十二点',
           'dinner': '十九点'
       }
    }

3. 常用
3.1 条件句（if）
    * {?是否存在}存在{:else}不存在{/是否存在}
    * {^是否不存在}不存在{:else}存在{/是否不存在}
    * 帮助函数
        * `{@eq}`： 严格等于,相当于===

        * `{@ne}`： 不完全等于，相当于==

        * `{@gt}`： 大于

        * `{@lt}`： 小于

        * `{@gte}`： 大于等于

        * `{@lte}`： 小于等于

        {! 模板 if条件判断 !}
        {#girlfriend}
            他有女朋友这个属性
        {:else}
            他没有女朋友这个属性
        {/girlfriend}
        {@eq key=age value=23}他今年23了,{:else}他今年不是23{/eq}
        {@gt key=age value=22}他的年龄大于22{:else}他的年龄小于22{/gt}

3.2 循环（for）
    * Dust默认会循环数组块体；
    * `{@sep}`： 在每一次循环中输出(除最后一次)。

    * `{@first}`： 只在第一次循环中输出。

    * `{@last}`： 只在最后一次循环中输出。

        {! for循环 !}
        {#hobbies}
            {@first}她喜欢{/first}
            {@last}和{.}{/last}
            {@sep}{.}{/sep}
        {/hobbies}

3.3 条件判断(switch)
`@select`组成一个类似`switch`的结构，允许你基于一个简单的key/value，一步进行多样的比较处理。你把`key`属性放到`@select`帮助函数里，只设置`@select`里每个逻辑函数的`value`属性。

你可以在`@select`里使用`@none`帮助函数指定，如果没有条件符合应该怎么做。相对的，如果`@select`里只要有一个满足就执行的，可以使用`@any`帮助函数。

当一个正确的逻辑判断被找到时，Dust会执行对应的条件体，并跳过剩下的正确判断。`{@any}`和`{@none}`判断则每次执行，无论是否发生。

        {! 模板 switch条件 !}
        {#eat}
            {@select key=dinner}
                {@eq value="八点"}{key}吃早餐{/eq}
                {@eq value="十二点"}{key}吃午餐{/eq}
                {@eq value="十九点"}{key}吃晚餐{/eq}
                {@any}。{/any}
                {@none}今天没吃饭{/none}
            {/select}
        {/eat}

4. 模板处理
* 母模板是公共模板，子模板是个性模板，是最后实际的模板
**注**: 模板名字加引号的必须是双引号""。

* 子模板中，引入母模板的同时传入参数 `{>partial foo="bar" contacts="friends"}`;

* 母模板给子模板留的空位（如果子模板没有覆盖，则默认输出hello!）

    {+greeting}hello!{/greeting}

* 子模板填充母模板的空位

   {<greeting}hello!{/greeting}


        {! 子模板引入公共模板，并填公共模板的坑 !}
            {> "views/common.dust"/}
            {< name}
                小灰
            {/name}
        {! 公共模板留坑 !}   
            我的名字是
            {+name}
                小黑
            {/name}
