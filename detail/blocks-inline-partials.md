## 块级和行内局部模板

做多页面的web应用的重要需要是将一个页面的共同元素共享到所有页面(不要重复自己)。考虑到几个页面有共同的头部和尾部但是又不同的主体内容，Dust提供了块级行内局部模板概念。

基础模板的块体可以包含默认的内容,一个子模板能覆盖这个内容。

****** `{+name}default Content{/name}`

在下面的例子中，基础模板有三个块体:`pageHeader`、`bodyContent`、和`pageFooter`。如果子模板没有覆盖,
`pageHeader`和`pageFooter`有默认的内容展示。你会注意到下面的没有子模板，基础模板渲染默认的头部和脚部内容，但是没有主体内容。

        // 基础模板(base_template)
        <div class="page">
            <h1>{+pageHeader}LinkedIn{/pageHeader}</h1>
            <div class="bodyContent">
                {+bodyContent/}
            </div>
            <div class="footer">
                {+pageFooter}
                    <a href="/contactUs">Contact Us</a>
                {/pageFooter}
            </div>
        </div>

        // data 数据源
        {}

        // 输出
        <div class="page"><h1>LinkedIn</h1><div class="bodyContent"></div><div class="footer"><a href="/contactUs">Contact Us</a></div></div>

我们已经定义了一个基础模块，其中包含已命名的块级页头，主体内容，页尾。让我们看看是否子模板可以在提供主体内容和覆盖页尾的基础上使用它。首先，插入一个基础模板作为局部模板。然后使用一个或多个在子模板的同名块体覆盖基础模板的同名块体。你可以看到下面的例子里我们覆盖了`bodyContent`部分和`pageFooter`部分。`pageHeader`部分没有被覆盖，它显示它默认的内容。

        // 子模板(child_template)
        {! First, insert the base template as a partial !}
        {>"base_template"/}
        {<bodyContent}
        <p>Your body content</p>
        {/bodyContent}
        {<pageFooter}
               This is a NEW footer
        {/pageFooter}

        // data 数据源
        {}

        // 输出
        <div class="page"><h1>LinkedIn</h1><div class="bodyContent"><p>Your body content</p></div><div class="footer">This is a NEW footer</div></div>

**警告**: 行内模板的名字在Dust中是全局的。

    {<name}xxx{/name}
    {+name/}

    ...
    {! Oops! {+name/} above will be 'zzz' !}
    {<name}zzz{/name}

子模板内部的基础模板的"坑"的显示名和基础模板里的"坑"的名字保持一致Dust才能渲染。