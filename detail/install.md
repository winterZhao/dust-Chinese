## 安装

### 安装Dust

#### npm

作为一个node模块安装

        npm install --save --production dustjs-linkedin

        # If you want the core helpers addon
        npm install --save --production dustjs-helpers


Dust应该运行在高于0.8.1版本的Node或者io.js

Dust命令行编译器位于`./node_modules/.bin/dustc`;为了使Dust全局可用，运行`npm install`时带上`-g`标识符。

#### Bower

使用Bower安装

        bower install dustjs-linkedin

Dust兼容IE7+及所有现代浏览器


#### 下载

在[Github releases page](https://github.com/linkedin/dustjs/releases)你能下载当前的和过去的Dust版本


### 加载Dust

#### Node

        var dust = require('dustjs-linkedin');

#### 浏览器

在页面中包含`dust-core.min.js`或者`dust-full.min.js`;如果你想在浏览器环境编译dust模板，使用`dust-full.min.js`。

#### AMD

自Dust2.6.0版本起，你可以使用AMD方式，例如require.js加载Dust。
为了向后兼容，你必须写一个配置标志告知Dust将被作为一个指定的AMD模块进行注册(和jquery在AMD下一样)。

        define.amd.dust = true;

做好后，你可以加载`dust-core.js`或者`dust-full.js`作为一个模块。

        <script src="r.js"></script>
        <script type="text/javascript">
            define.amd.dust = true;
            require(["lib/dust-full"], function(dust) {
                dust.render(...);
            });
        </script>


##### dust-helpers

如果你使用`dustjs-helpers`1.6.0或之前的版本，也需要注册`dust-helpers`作为一个匿名的AMD模块。在Dust被加载后，如果你引入`dust-helpers`会运行的更好。

        define.amd.dust = true;
        require(["lib/dust-full"], function(dust) {
          require(["lib/dust-helpers"], function() {
            // dust helpers are available when you call dust.render()
          });
        });
