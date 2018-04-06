## 模板语法参考

#### `{引用}`(`reference`)

引用通常被用来从上下文(或者JSON数据)插入数据到模板。

        {key[|filter1|filterN]}

引用以`{`开始，后面跟着Dust路径，有选择性的跟着一个或多个选择器，以`}`结尾。

Dust路径是一个或多个Dust关键字，以点号`.`分隔。

Dust关键字只能是一个或多个以下字符:`a-z`,`A-Z`,`_`,`$`,`0-9`或者`-`。

**注**: 引用的第一个字符不能是`0-9`或者`-`。

#### 注释 `{! comments !}`

Dust注释通常写在文件里，模板渲染的时候会忽略。格式如下：

`{! All Dust comments are multiline comments !}`

        // 注释
        Comments {! in Dust !}can be used for documentation.{~n}
        Comments can also be used {! <button>Click me!</button> !}to test or remove features.

        // 输出

        Comments can be used for documentation.
        Comments can also be used to test or remove features.

#### 块体上下文 `{#section/}`

一个标准的块体上下文通常被用来改变查找数据的上下文。如果新的上下文是个数组，标准的块体上下文会自动的遍历数组，如果使用了`{:else}`，如果新的上下文不存在，它的内容会输出。

        // 块体上下文。
        {!
          Outside of the section, Dust looks for values
          at the root of the JSON context
        !}
        The value of name is: {name}{~n}
        {#extraData}
          {!
            Inside this section, Dust looks for
            values within the extraData object
          !}
          Inside the section, the value of name is: {name}{~n}
        {/extraData}
        The value of name is: {name}, again.{~n}
        {#nonExistentContext}
          This is only output if "nonExistentContext" exists.
        {:else}
          Because "nonExistentContext" does not exist, the else body is output.
        {/nonExistentContext}

        // 数据源
        {
          "name": "Jimmy",
          "extraData": {
            "name": "Kate"
          }
        }

        // 输出
        The value of name is: Jimmy
        Inside the section, the value of name is: Kate
        The value of name is: Jimmy, again.
        Because "nonExistentContext" does not exist, the else body is output.

一个块体上下文以`{`开始，然后是`#`,后面跟着Dust路径，以`}`结尾，然后跟着的是内容，最后以同样的闭合标签加路径结尾，格式如下:

    {#key}
        Some content
    {/key}

块体上下文包含`{:else}`否定

        {#key}
            Some content
        {:else}
            Some other content, if key doesn't exist in the context。
        {/key}

自闭合的块体上下文(无用，但是Dust技术上实现了)

        {#key/}

#### 判断存在的块体上下文 `{?exists}`
判断存在的块体上下文的作用是如果判断引用的值存在，则输出的值的内容。判断存在的块体上下文与标准块体上下文一样，只是`#`用`?`代替。然后，不像标准的块体上下文，判断存在的块体上下文不能改变上下文。

        // 判断存在
        {?isReady}Ready!{:else}Wait a minute...{/isReady}

        // 数据源
        {
          "isReady": false
        }

        // 输出
        Wait a minute...


#### 判断不存在的块体上下文 `{^not-exists}`
判断不存在的块体上下文的作用是如果判断引用的值不存在，则输出的值的内容。判断不存在的块体上下文与标准块体上下文一样，只是`#`用`^`代替。然后，不像标准的块体上下文，判断不存在的块体上下文不能改变上下文。

        // 判断不存在
        {^isReady}Not ready yet.{:else}I'm ready to go!{/isReady}

        // 数据源
        {
          "isReady": false
        }

        // 输出
        Not ready yet.

#### @帮助函数 `{@helper}`
帮助函数是一类在渲染的时候执行一些Javscript代码的块体上下文。对于使用帮助函数的更多信息，请看[Dust helpers guide](http://www.dustjs.com/guides/dust-helpers/)。更多有关写Dust帮助函数的信息，请看[帮助函数写法指导](http://www.dustjs.com/guides/writing-helpers)。

// 帮助函数(helper)
The answer is {@eq key=answer value=42}42{:else}wrong{/eq}.

// 数据源
{
  "answer": 42
}

// 输出
The answer is 42.

#### 行内局部模板(`{<inline-partial>}`)
行内局部模板是Dust中惰性的可以在Dust模板中多次被插入的。使用一个块体插入行内局部模板。使用行内局部模板和块体的例子，请看[模板使用和覆盖指南](http://www.dustjs.com/guides/base-and-override-templates)。

行内局部模板以`{`开始,然后是`<`，然后是名字(和Dust关键字保持一致)，然后是`}`，紧接着是一些内容，跟着闭合标签。格式如下:

**`{<className}primary hero {/className}`**

自闭合块体以`{`开始，紧跟着`+`，然后是行内局部模板的名字，紧跟着`/}`。一个块体可以有内容，也可以没有。块体内容只在没有找到匹配的行内局部模板时输出。更多信息，请看[模板使用和覆盖指南](http://www.dustjs.com/guides/base-and-override-templates)。

        // 行内局部模板(inline_partial)
        {+greeting}hello!{/greeting}world
        {<greeting}Howdy{/greeting};

        // 数据源
        {}

        // 输出
        Howdy world

#### 局部模板`{>partial}`

局部模板通常用作将一个dust模板引入到另一个dust模板中。

所有字符都可用于模板名字。然而，如果模板名字包括Dust引用中不允许的字符。当引入作为模板时，你应该用引号包裹模板名字。

基本例子

        {> my_template /}
        {> "my template name has *special* characters"}

也可以带参数

        {> my_template_with_params foo="bar" contacts="friends" /}


#### 特殊字符 `{~special}`

特殊字符起一些特殊的作用。

特殊字符以`{`开始,紧跟着`~`，然后是支持的字符，然后是`}`，Dust支持五种特殊字符。

* `{~s}` 变成一个空格；
* `{~n}` 变成换行；【无效】
* `{~r}` 变成按一下回车符；【无效】
* `{lb}` 变成`{`；
* `{rb}` 变成`}`
