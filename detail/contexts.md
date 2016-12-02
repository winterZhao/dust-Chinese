## 上下文

Dust引用的，被用来渲染模板的数据是一个上下文。上下文是Javascript对象，数组，常量的集合。Dust可以查找多层次的数据集合，无论是顶级数据还是内嵌的数据。

这个例子中,注意Dust如何移动到父级上下文。

* 当前上下文被设置到子元素`{#children}`里；

* Dust在当前上下文中找到子节点的`firstName`；

* Dust在当前上下文中不能找到`lastName`字段，所以它移动到外层父级上下文去再一次查找。

        // 在父级查找(search-upwards)
        Parent: {firstName} {lastName}{~n}
        Children: {#children}{firstName} {lastName} {/children}

        // 数据源
        {
          "firstName": "John",
          "lastName": "Smith",
          "children": [
            { "firstName": "Alice" },
            { "firstName": "Bobby" },
            { "firstName": "Charlie" }
          ]
        }

        // 输出
        Parent: John Smith
        Children: Alice Smith Bobby Smith Charlie Smith


### 增加删除上下文（Pushing and Popping Context）

你可以通过使用`context.push`增加新的上下文到顶级上下文中，已有的上下文结构不会被修改，增加会返回一个新的上下文。同事当前上下文环境移动到新的上下文中。

自Dust2.6.2版本起，`context.pop`移除顶级上下文环境并且返回它，已有的上下文结构被修改。

特殊的引用符号`{.}`总是引用当前上下文的中的数据源。

        // 增加删除上下文(push)
        Current context: {.}{~n}
        Dust can search upwards: {foo}{~n}
        But, it can't search up and then down: {two}{~n}
        So you need to search up, and then start a new search: {#one}{two}{/one}{~n}
        Or, you can search up, and then do a dotted lookup: {one.two}

        // 数据源
        (function() {

        var context = dust.makeBase();
        var newContext = context.push({ "foo": "bar", "one": { "two": "Hello!" } })
                                .push("level2")
                                .push("level3")
                                .push("level4")
                                .push("this one gets popped off");

        newContext.pop();

        return newContext;

        })()

        // 输出
        Current context: level4
        Dust can search upwards: bar
        But, it can't search up and then down:
        So you need to search up, and then start a new search: Hello!
        Or, you can search up, and then do a dotted lookup: Hello!


### 全局上下文
当创造一个上下文时，你可以同时提供一个无论当前上下文在哪里，都可以全局访问的第二全局上下文。增加一个全局上下文，使用`dust.makeBase`(自Dust2.7.1起也可以使用`dust.context`)去创造一个上下文环境。然后，将这个上下文环境传给`dust.render`去渲染。

全局上下文位于上下文堆中的最低层，所以它可以被任何定义了对应引用的更高一级的上下文所盖住。


        // 全局上下文(global)
        Hello {global} {name}!{~n}
        {#friend}Hello {global} {name}!{/friend}

        // 数据源
        (function() {

        var context = dust.makeBase({ "global": "global", "name": "World" });

        return context.push({
          "friend": {
            "name": "Dusty"
          }
        });

        }())

        // 输出
        Hello global World!
        Hello global Dusty!

### 上下文选项(Context Options)(Dust2.7.1起)
上下文选项对模板是不可见的。你可以把他们看做是在你的应用中传递请求数据到上下文的。(想想Express局部变量对于模板是不可见的。)

当加载非缓存模板时，Dust可能传递任何上下文选项到你的[`dust.onLoad`方法](http://www.dustjs.com/guides/onload/)

如果想要增加任何上下文选项，传递一个对象作为`dust.makeBase`/`dust.context`的第二个参数。

        var context = dust.context(null, { lang: 'en' });
        context.options.lang === 'en'; // true

###上下文中的特殊值

对象、数组、字符串、数字和其他字面量可以同样地在上下文中重新取回。Dust区别对待下面这些上下文值:

#### 函数

Dust不是返回函数的渲染结果，而是首先执行函数，传递它的返回值到模板，函数会唤起Dust在渲染过程中对它进行更多的处理。

这些特殊的函数被归类到上下文帮助函数(**context helpers**)。如何写上下文帮助函数，请看[上下文帮助函数指导](http://www.dustjs.com/guides/context-helpers/)

#### Promise(Dust 2.6.2)

自Dust2.6.2 起，当Dust在上下文数据中遇到Promise时，它等待Promise执行(resolved)或者拒绝(rejected)，再提供值给模板渲染。

如果Promise返回值，将直接执行，如果Promise被拒绝(rejected)，返回值不会输出。

如果Promise是个块体上下文(section)，它的返回值将被放到上下文堆中。如果Promise被拒绝，Dust在块体上下文中寻找一个`{:error}`块去执行它。

你甚至可以直接引用Promise最终返回值的属性名，即使Promise还没用被执行(resolve)。

**注释**: Dust要求你在上下文中提供的Promise对象的`.then`方法符合[Promise/A+规范](https://github.com/promises-aplus/promises-spec/blob/master/implementations.md)


        // promise
        Your IP address is {jsonTest.ip}

        // 数据源
        {
          "jsonTest": $.getJSON("http://ip.jsontest.com/")
        }

        // 输出
        Your IP address is 192.0.0.1

流（Dust 2.7.0版本）

自Dust 2.7.0起，Dust可以在上下文中读取类似Node的流式操作。当Dust找到一个流，它会增加`data`，`error`,`end`监听者。

一个Buffer或者字符串样子的流可以作为引用(属性值为字符串)或者块级上下文(属性值为对象或数组)。一个对象类的流只能做为块级上下文。

当一个流作为一个块级上下文时，Dust在完成前将迭代每个流。如果你流式输出大量的数据这是有用的。因为浏览器可以立即开始渲染响应。(结合`dust.stream`)。否则，Dust将等待`end`事件触发再开始渲染。（流的优点）

如果一个流不触发`end`或者`error`事件,模板将不会停止渲染。你可以在超时后设置触发`end`事件以保护你的流操作实现。