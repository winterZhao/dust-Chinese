## Compiling and Rendering

在[起步](http://www.dustjs.com/guides/getting-started/)指南中,你学会了如何写Dust模板。现在，让我妈了解如何使用你的模板渲染页面。

### 编译，加载和渲染(Compile,Load,and Render)

* 在你使用你的模板前，它必须被编译到一个Javascript函数中。

* 在你得到一个编译后的模板后，你必须在Dust中注册它以便你可以通过名字查找它。

* 最后，你可以通过模板名字去渲染模板或者将它传给客户端。

**警告**: 与渲染(render)相比，编译(compile)一个模板很慢。因此，在进入生产环境中，你应该预编译你的模板作为你的构建过程中的一部分。

我们看看如何用不同的方式去编译，加载，渲染模板。

#### 浏览器: 基础

**警告**:尽管生产环境中在浏览器环境直接编译是有效的，但是你不应该在你的站点页面中那样做，因为那样渲染模板会很慢。

此外，在浏览器环境中使用方法`dust.compile`和`dust.renderSource`要求你包含`dust-full.js`，而`dust-full.js`比`dust-core.js`要大。

        <script type="text/dust" id="hello">Hello {world}!</script>
        <script type="text/javascript">
            var src = document.getElementById('hello').textContent;
            // Compile the template under the name 'hello'
            var compiled = dust.compile(src, 'hello');
            // Register the template with Dust
            dust.loadSource(compiled);
            // Render the template
            dust.render('hello', { world: "Earth" }, function(err, out) {
              // `out` contains the rendered output.
              document.getElementById('output').textContent = out;
            });
        </script>

简洁写法，你可以使用`dust.renderSource`;

        // compiles, loads, and renders
        dust.renderSource(src, { world: "Alpha Centauri" }, function(err, out) { ... });

自Dust2.7.0版本起,编译模板时模板的名字不是必需的，`dust.loadSource`将返回一个模板方法，你可以直接传递这个方法给`dust.render`。

        var compiled = dust.compile(src);
        var tmpl = dust.loadSource(compiled);
        dust.render(tmpl, { world: "Betelgeuse" }, function(err, out) { ... });


#### 浏览器: 预编译模板

        <!-- precompiled templates -->
        <script type="text/javascript" src="/lib/templates.js"></script>
        <script type="text/javascript">
            // The templates are already registered, so we are ready to render!
            dust.render('hello', { world: "Saturn" }, function(err, out) {
            document.getElementById('output').textContent = out;
            })
        </script>

#### 浏览器: AMD(require.js)

首先,阅读指南[loading Dust as an AMD module](http://www.dustjs.com/guides/setup/#amd),你必须使用2.6.0或者更高版本的Dust。

通过设置`dust.config.amd`为`true`，你可以以AMD模块的方法编译你的模板。最容易的方式是通过使用`dustc`加`--amd`标志，创建AMD模板。（学习如何使用`dustc`，看`dustc`[文档](http://www.dustjs.com/docs/dustc-api/))。

如果一个模板没有通过`require`引入，Dust将尝试通过模板的名字以`require`的方式加载它。为了实现这一功能，模板应该以一个符合AMD加载器要求的命名格式去编译。例如，一个位置为`tmpl/home/main.js`的模板，必须被命名为`tmpl/home/main`以便Dust可以正确加载它。如果你使用`dustc`编译器,这样做事方便易操纵的。

        <script src="r.js"></script>
        <script type="text/javascript">
            define.amd.dust = true;
            require(["lib/dust-core"], function(dust) {
            dust.render('tmpl/hello', { world: "Jupiter" }, function(err, out) {
            // dust will call `require(['tmpl/hello'])` since that template isn't loaded yet
              });
            });
        </script>

你可以预加载模板通过使用引入时代表引入的形参。自Dust2.7.0版本起，你可以直接传递模板给`dust.render`而不是使用模板名字。

        require(["lib/dust-core", "tmpl/hello"], function(dust, helloTemplate) {
            // Dust >= 2.6.0
            dust.render('tmpl/hello', { world: "Mars" }, function(err, out) { ... });
            // Dust >= 2.7.0
            dust.render(helloTemplate, { world: "Pluto" }, function(err, out) { ... });
        })


#### Node：基础

**警告**: 尽管生产环境中在服务器端直接编译是有效的，但是你不应该在你的站点页面中那样做，因为那样渲染模板会很慢。

        var src = fs.readFileSync('/views/hello.dust', 'utf8');
        var compiled = dust.compile(src, 'hello');
        dust.loadSource(compiled);
        dust.render('hello', { world: "Venus" }, function(err, out) {
          // `out` contains the rendered output.
          console.log(out);
        });

#### Node: 加载预编译的模板

        // 早于2.7版本
        fs.readFile(templateName + '.js', { encoding: 'utf8' }, function(err, data) {
            dust.loadSource(data);
            dust.render(templateName, {}, function(err, out) {
                console.log(out);
            });
        });
        // 作为CommonJS模板预加载，自2.7版本起;
        app.get('/hello', function(req, res) {
            var tmpl = require('./views/hello.js')(dust);
            tmpl({world: 'Neptune'}, function(err, out) {
                res.send(out);
            });
        });

#### Node: 动态加载模板

生产环境中有很多模板，告诉Dust如何加载模板而不是手动加载他们死更好的处理方式。为了实现这个目标，你必须[配置一个`dust.onLoad`函数](http://www.dustjs.com/guides/onload/)

### 禁止缓存

一旦Dust注册了一个模板，它将不会尝试再次加载它。这对于性能是好的，但是似的修改模板、重新加载模板看到效果变得困难。

自Dust 2.7.0起，你可以设置`dust.config.cache`为`false`，使缓存在生产环境中失效，这样Dust每次都会重新加载模板。

### Dust和Express.js

很多开发者想在它们使用Express搭建的Node服务器中使用Dust渲染页面。这里有几个Express下的Dust渲染引擎帮助加载、编译、缓存Dust模板。它们是:

* [Adaro](https://www.npmjs.com/package/adaro) `Kraken`框架的一部分

* [Hoffman](https://www.npmjs.com/package/hoffman) 对于流有着很好的支持；

* [klei-dust](https://www.npmjs.com/package/klei-dust) 支持模板嵌套的相对路径

* [consolidate](https://www.npmjs.com/package/consolidate) 也支持很多其他模板引擎


### 预编译模板
如果你没有使用Express模板引擎，最好的使用Dust的方式是将模板的编译过程作为你构建过程的一部分。以下罗列了一些通用的方式去实现它:

* 使用[`dustc`，命令行编译工具](http://www.dustjs.com/docs/dustc-api/)(在开发环境中使带上`--watch`选项)。

* 使用grunt插件比如[grunt-dustjs](https://github.com/STAH/grunt-dustjs)

* 使用gulp插件比如[gulp-dust](https://www.npmjs.com/package/gulp-dust)