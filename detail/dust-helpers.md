## Dust Helpers

### 使用帮助函数

Dust帮助函数和上下文帮助函数以同样的方式扩展了模板语言。与上下文帮助函数不同，Dust帮助函数是全局可用的，使用时不用把它包括在上下文。

帮助函数是这样的格式 `{@helper}`。

### 安装帮助函数

官方支持的帮助函数被分开放置在`dustjs-helper`包里。dustjs-linkedin包下载后，照着[安装文档](http://www.dustjs.com/guides/setup/)安装`dustjs-helpers`。

如果你是用Node.js,那么你可以直接引入帮助函数。帮助函数被预加载后会返回一个Dust实例。

        var dust = require('dustjs-helpers');

### 逻辑帮助函数

帮助函数包有下面几个逻辑帮助函数:

* `{@eq}`： 严格等于,相当于===

* `{@ne}`： 不完全等于，相当于==

* `{@gt}`： 大于

* `{@lt}`： 小于

* `{@gte}`： 大于等于

* `{@lte}`： 小于等于

如果两个值比较返回布尔值为true,这些帮助函数允许你输出上下文。每个帮助函数的格式是key属性的属性值为字段名，value属性的属性值为字段值。`key`和`value`可以指向一个引用，或者字面量值。可以使用字面量值所对应的属性名作为字面量值的"显示名"被引用。

下面的例子中，第一个帮助函数在JSON数据根节点上寻找`level`属性的值，并且检测这个值是否和字符串'master'是否相等。第二个帮助函数判断是否`age`字段的值是否大于`starfighterRentalAge`字段的值。

        // 逻辑帮助函数(helpers_logic)
        {@eq key=level value="master"}You are no longer a Padawan. {/eq}
        {@gt key=age value=starfighterRentalAge}Rent a Starfighter!{/gt}

        // 数据源
        {
          "level": "master",
          "age": 27,
          "starfighterRentalAge": 25
        }

        // 输出
        You are no longer a Padawan. Rent a Starfighter!


****** Else

对于所有的逻辑帮助函数，你可以创造一个`{:else}`代码块，如果判断是错误的，它将会输出。

        // 逻辑帮助函数的else(helpers_else)
        {@eq key=level value="master"}
          You are no longer a Padawan.
        {:else}
          You have much to learn, young Padawan.
        {/eq}

        // 数据源
        {
          "level": "padawan"
        }

        // 输出
        You have much to learn, young Padawan.

****** 数据类型
如果你正在拿一个字符串和一个你知道不是字符串的值(例如一个数字或者布尔值)进行比较，请务必增加`type`属性，以便Dust知道如何处理字符串值。(**注**:原因在于`eq`为===，所以必须加数据类型判断，换成`ne`也可)

        // 逻辑帮助函数的casting(helpers_casting)
        {@eq key=bilbosAge value="50" type="number"}Looking nifty at fifty, Bilbo! {/eq}
        {@gt key=gandalfsAge value="10000"}Gandalf is really old...{/gt}

        // 数据源
        {
          "bilbosAge": 50,
          "gandalfsAge": 12345
        }

        // 输出
        Looking nifty at fifty, Bilbo! Gandalf is really old...

### 分隔符帮助函数(Separator Helper)

列表的迭代通常会要求列表的首项和尾项有一些不同的处理。`{@sep}`和`{@first}`、`{@last}`帮助函数提供这个功能。

* `{@sep}`： 在每一次循环中输出(除最后一次)。

* `{@first}`： 只在第一次循环中输出。

* `{@last}`： 只在最后一次循环中输出。


        // 正确语法
        {#guests}
          {@first}Hello {/first}
          {@last}and {/last}
          {.}{@sep}, {/sep}
          {@last}!{/last}
        {/guests}

        // 数据源
        {
          "guests": ["Alice", "Bob", "Charlie"]
        }

        // 输出
       Hello Alice, Bob, and Charlie!


#### 选择帮助函数

`@select`帮助函数可以被嵌套在其他逻辑帮助函数里，组成一个类似`switch`的结构，允许你基于一个简单的key/value，一步进行多样的比较处理。你把`key`属性放到`@select`帮助函数里，只设置`@select`里每个逻辑函数的`value`属性。

你可以在`@select`里使用`@none`帮助函数指定，如果没有条件符合应该怎么做。相对的，如果`@select`里只要有一个满足就执行的，可以使用`@any`帮助函数。

当一个正确的逻辑判断被找到时，Dust会执行对应的条件体，并跳过剩下的正确判断。`{@any}`和`{@none}`判断则每次执行，无论是否发生。

        // 正确语法
        <span class="
          {@select key=testEnabled}
            {@any}test-enabled {/any}
            {@none}test-disabled {/none}
            {@eq value="puppies"}test-puppies{/eq}
            {@eq value="bunnies"}test-bunnies{/eq}
          {/select}
        ">

        // 数据源
        {
          "testEnabled": "bunnies"
        }

        // 输出
       <span class="test-enabled test-bunnies">


`@default`帮助函数自1.6.0版本的Dust帮助函数起就已被废弃。这个帮助函数和`@none`类似，除了它只是每个`@select`的一个实例，需要被放到所有逻辑帮助函数之后以确保前面的所有比较都是错的。

### 数学帮助函数

`{@math}`帮助函数可以在模板中执行简单的数学运算，以便输出或者对结果进行真值判断。它允许`key`参数、`method`参数以及`operand`参数去进行需要两个参数的运算，像加法和减法。

你可以将逻辑帮助函数放到数学帮助函数里，以检验操作的结果。

        // helpers_math
        <ul>
          {#flavors}
            <li
              {@math key=$idx method="mod" operand="2"}
                {@eq value="0" type="number"} class="alt"{/eq}
              {/math}>
              {name}
            </li>{~n}
          {/flavors}
        </ul>

        // 数据源
        {
          "flavors": [
            { "name": "red bean" },
            { "name": "green tea" },
            { "name": "mango" },
            { "name": "peanut" }
          ]
        }

        // 输出
       <ul><li class="alt">red bean</li>
       <li>green tea</li>
       <li class="alt">mango</li>
       <li>peanut</li>
       </ul>

###### 输出结果

如果只是简单的暑促数学表达式的结果，请使用没有代码体的`{@math}`帮助函数。

        // helpers_math
        There is {@math key=100 method="subtract" operand=progress/}% left

        // 数据源
        {
          "progress": 70
        }

        // 输出
        There is 30% left to do.

###### 允许的操作

`{@math}`帮助函数支持以下几种操作方法:

* add, subtract

* multiply, divide, mod

* ceil, floor, round, toint

* abs

### `@contenxtDump`调试

`@contextDump`帮助函数输出JSON数据的当前上下文部分到标准输出流，这在上下文数据不没有预期输出并且你不知道当前上下文在哪的时候，能帮助调试。

你可以通过设置`key="full"`打印全部上下文，使用`to="console"`输出到控制台。

当你完成调试后移除这个帮助函数。

        // helpers_contextdump
        {#houses.gryffindor}
          {! Default: key="current" and to="output" !}
          {@contextDump/}
          {! Check your console for the full context !}
          {@contextDump key="full" to="console"/}
        {/houses.gryffindor}

        // 数据源
        {
          "houses": {
            "gryffindor": {
              "founder": "Godric Gryffindor"
            },
            "hufflepuff": {
              "founder": "Helga Hufflepuff"
            }
          }
        }

        // 输出
        {
          "founder": "Godric Gryffindor"
        }

**key**
* current
* full

**to**
* output
* console ：未起作用。

### 增加新的帮助函数

帮助函数的写法和上下文帮助函数是一样的，一旦你写完你的帮助函数，将它添加到`dust.helpers`实体。

        function yell(chunk, context, bodies, params) {
          return chunk.tap(function(data) {
            return data.toUpperCase();
          }).render(bodies.block, context).untap();
        }
        dust.helpers.yell = yell;

### 返回值

帮助喊可以直接返回一个值，值可以是字面量也可以是块体。当一个帮助函数没有函数体时，它表现为一个字面量。你可以通过增加一个`filters`属性传递过滤器到类字面量的帮助函数。

        {@myHelper value=name filters="|s|uc" /}

如果帮助函数有函数体，它更像一个块体。Dust将迭代从帮助函数返回的值。

        {@myHelper value=name}Hello {foo}!{/myHelper}

如果你需要对默认行为有更多的控制(例如，如果你想默认渲染一个已命名的函数体或非HTML无害化的)，你的帮助函数需要返回传给它的数据块(Chunk)。

### 返回一个数据块

直接写并且渲染数据块，然后在你的帮助函数返回它。Dust将照传入模板的样子返回数据块(Chunk)而不会应用任何过滤器。如果你想要你的帮助函数使用过滤，你可以手动使用`dust.filter`。

记住不能传入转义的HTML到`chunk.write`，因此写的时候要注意。
