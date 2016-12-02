## 使用过滤器

过滤器通常被用来在变量输出前转化它。你可以针对一个变量使用一个或多个过滤器，你也可以给Dust增加built-in过滤器。<p style='color:red;'>有问题</p>

### 使用过滤器

过滤器通过在Dust引用数据源后面添加`|`以及过滤器名字于Dust数据源相关联。你可以增加多个过滤器。多个过滤器将会从左到右依次运行。


        // 过滤filters
        {title}{~n}
        {title|s}{~n}
        {title|js|s}

        // 数据源
        {
          "title": '"All is <Fair> in Love & War"'
        }

        // 输出
       "All is <Fair> in Love & War"
       "All is in Love & War"
       "\"All is \u003cFair> in Love & War\""


### Built-In 过滤器

* h - HTML编码;

* s - 关闭自动HTML编码

* j - Javascript字符串编码

* u - URL编码(encodeURI,不会对本身属于URI的特殊字符进行编码，例如冒号、正斜杠、问号和井字号)

* uc - URI编码(全部编码);

* js - 转化为JSON字符串(JSON.stringify)

* jp - 转化为JSON对象(JSON.parse)

Dust默认对所有的引用数据应用`h`过滤器。如果想要变量不被HTML转义，你可以通过增加`s`过滤器取消自动转义。


### 创造新的过滤器

参考[the filter API](http://www.dustjs.com/docs/filter-api)

