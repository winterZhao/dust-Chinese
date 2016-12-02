## 加载模板

当你尝试渲染一个页面或者引入一个区块，Dust在缓存里查看模板的名字。如果模板不存在，将会渲染失败并且Dust抛出错误。

通过`dust.onLoad`,你可以创造函数来告诉Dust如何去加载不在缓存里的模板。如果请求的模板不在缓存里，Dust将执行函数并尝试加载它。

        dust.onLoad = function(templateName, [options], callback) {
          // `templateName` is the name of the template requested by dust.render / dust.stream
          // or via a partial include, like {> "hello-world" /}
          // `options` can be set as part of a Context. They will be explored later
          // `callback` is a Node-like callback that takes (err, data)
        }

### 回调函数

回调函数可以以不同的方式使用，这依赖于你想如何加载和注册你的模板。

###### 未编译的模板源

你可以加载一个没有编译的模板，并将它传给回调函数。Dust将编译模板并以模板名字注册它。

        fs.readFile(templateName + '.dust', { encoding: 'utf8' }, function(err, data) {
          callback(null, data);
        });

###### 预编译的模板源

如果模板预编译过，你可以直接加载它以减少编译的时间。当你执行回调时，Dust将再次在缓存中查找你注册的模板。

        // pre-2.7: load a compiled Javascript file
        fs.readFile(templateName + '.js', { encoding: 'utf8' }, function(err, data) {
          dust.loadSource(data);
          callback();
        });
        // 2.7: you can compile templates as CommonJS modules
        require('./views/' + templateName)(dust);
        callback();


###### 加载一个不同的模板(Dust 2.7.1起)

在某些情况下，你可能不想加载某个特定名字的模板，而是使用那个名字去找到一个不同的模板去加载。例如，如果你有两个模板，名字是`hello_en`和`hello_fr`;你可以按照使用者的语言设置。

如果你传递一个编译过的模板给回调函数，这个模板将会被渲染而不是原先请求的模板。新的模板不会以原先的名字注册。

`options`可以作为传递给Dust的上下文中的一部分被渲染。关于`options`的信息，请看[Context Options](http://www.dustjs.com/guides/contexts/#context-options-dust-271)

        dust.onLoad = function(templateName, options, callback) {
          // templateName is 'hello'
          var name = templateName + '_' + options.lang;
          // name is 'hello_fr'
          // Look in the cache for the template, and load it if isn't there
          var tmpl = dust.cache[name] || require('./' + name)(dust);
          // The template is cached under 'hello_fr' for next time
          callback(null, tmpl);
        };