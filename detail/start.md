## 开始

欢迎来到Dust!在指导下练习将帮助熟悉Dust的核心特点和语法。为了完成练习，修改下面的“Dust模板”和数据以便输出值和`期望输出`相匹配。

### 写模板

#### 引用

要学习的第一件事是如何使用Dust引入你的数据。你将学会如何告知Dust引入的数据源，如果没有练习将会指导你。下面的例子中，一个Dust引用由一个花括号`{}`和包裹其中的JSON字段名。例子的意思是我们欢迎你来到Dust,但是问候有点太正式。

        // Dust 模板
        Welcome to Dust, {name}.

        // 数据源
        {
          "name": "friend",
          "familiarName": "pal"
        }

        // 例子的输出
        Welcome to Dust, friend.

        // 如果输出是pal,你要怎么修改模板？
        Welcome to Dust, pal.

#### 使用`.`符号的引用。

如果你需要引用嵌套对象的值，你可以像在JAVASCRIPT中一样使用`.`符号。

// Dust 模板
        Hello, {name}.

        // 数据源
        {
          "name": "friend",
          "familiarName": "pal"
        }

        // 例子的输出
        Welcome to Dust, friend.

        // 如果输出是下面,你要怎么修改模板？
        Welcome to Dust, pal.

了解更多关于[Dust引用](http://www.dustjs.com/docs/syntax/#reference)的知识。

#### 条件句

Dust可以通过`?`(存在)和`^`(不存在)包含带有条件的内容。下面的例子中，根据条件判断引用数据的值为true或者false,输出内容会相应发生改变。

        // 条件判断模板
        <input type="checkbox"{?isSelected} checked{/isSelected}>
        {?friends} {friends.length} Friends!{/friends}
        {?enemies} Oh no, enemies!{/enemies}

        // 数据源
        {
          isSelected: false,
          friends: ["Alice", "Bob"],
          enemies: ["Oscar"]
        }

        // 输出
        <input type="checkbox"> 2 Friends! Oh no, enemies!

        // 如果输出是下面,你要怎么修改模板？
        <input type="checkbox" selected> 2 Friends!

你也可以使用`{:else}`列举两种选择。

        // 条件判断模板
        <li class="result{?isPrimary} primary{:else} secondary{/isPrimary}">

        // 数据源
        {
          isPrimary: true
        }

        // 输出
        <li class="result primary">

        // 如果输出是下面,你要怎么修改模板？
        <li class="result secondary">

**真值判断**
Dust使用了略微不同于Javascript的真值(true)判断。为布尔值false的只有`null`,`undefined`和空数组，其他的值，比如字符串'false'，数字0，和空对象都被认为真值(true)。如果你想测试这些值，请看[Dust {@eq} and {@ne} helpers](http://www.dustjs.com/guides/dust-helpers/#logic-helpers)。

#### 块体上下文（section）

块体通常用来转换Dust查询引用的上下文(注:块体多为对象或数组),类似条件判断，是一种有用的，可替代冗长的点符号的符号。

在下面的例子中，块体以`{#friend}`开始，以`{/friend}`结束。当处在`{#firend}`块体中，Dust在`friend`对象里查找数据引用源。这就是为什么输出结果是`Hello,Jacob`而不是`Hello,John`。

        // 块体section模板
        Hello, {#friend}{name}{/friend}.

        // 数据源
        {
          "name": "John",
          "nickname": "Jingleheimer Schmidt",
          "friend": {
            "name": "Jacob"
          }
        }

        // 输出
        Hello, Jacob.

        // 如果输出是下面,你要怎么修改模板？
        Hello, John Jacob.

然而，如果Dust在给定的上下文中没有找到对应的引用字段，他将继续查找该上下文的父节点，直至找到为止。

        //查找上下文 reference_lookup
       Hello, {name} {#friend}{name} [[ PUT YOUR ANSWER HERE ]]{/friend}. That's my name, too.

        // 数据源
        {
          "name": "John",
          "nickname": "Jingleheimer Schmidt",
          "friend": {
            "name": "Jacob"
          }
        }

        // 输出
        Hello, John Jacob [[ PUT YOUR ANSWER HERE ]]. That's my name, too.

        // 如果输出是下面,你要怎么修改模板？
        Hello, John Jacob Jingleheimer Schmidt. That's my name, too.

#### 循环

Dust中循环很容易。事实上，一个循环是一个引用类型为数组的块体上下文。
在循环中，你可以使用`{.}`引用当前项，使用`{$idx}`显示当前项的索引，使用`{$len}`显示数组的长度。

        //循环loop
        <ul>
          {#languages}<li>[[ YOUR CODE GOES HERE ]]</li>{/languages}
        </ul>

        // 数据源
        {
          "languages": [
            "HTML",
            "CSS",
            "JavaScript",
            "Dust"
          ]
        }

        // 输出
        <ul><li>[[ YOUR CODE GOES HERE ]]</li><li>[[ YOUR CODE GOES HERE ]]</li><li>[[ YOUR CODE GOES HERE ]]</li><li>[[ YOUR CODE GOES HERE ]]</li></ul>

        // 如果输出是下面,你要怎么修改模板？
        <ul><li>HTML</li><li>CSS</li><li>JavaScript</li><li>Dust</li></ul>

当数组中包含对象，你可以通过里面对象的属性名获取到属性值。


        //循环loop
        <ul>
          {#languages}
            <li>[[ INSERT LANGUAGE NAME HERE ]] by {#creators}{.}{@sep} and {/sep}{/creators}</li>
          {/languages}
        </ul>

        // 数据源
        {
          "languages": [
            {
              "name": "HTML",
              "creators": ["Tim Berners Lee"]
            },
            {
              "name": "CSS",
              "creators": ["Håkon Wium Lie", "Bert Bos"]
            },
            {
              "name": "JavaScript",
              "creators": ["Brendan Eich"]
            },
            {
              "name": "Dust",
              "creators": ["akdubya"]
            }
          ]
        }

        // 输出
        <ul><li>[[ INSERT LANGUAGE NAME HERE ]] by Tim Berners Lee</li><li>[[ INSERT LANGUAGE NAME HERE ]] by Håkon Wium Lie and Bert Bos</li><li>[[ INSERT LANGUAGE NAME HERE ]] by Brendan Eich</li><li>[[ INSERT LANGUAGE NAME HERE ]] by akdubya</li></ul>

        // 如果输出是下面,你要怎么修改模板？
       <ul><li>HTML by Tim Berners Lee</li><li>CSS by Håkon Wium Lie and Bert Bos</li><li>JavaScript by Brendan Eich</li><li>Dust by akdubya</li></ul>

       现在你已经知道了Dust模板的基本写法，继续学习如何[编译和渲染你的模板]()吧