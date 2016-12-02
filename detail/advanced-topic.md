## 高级话题

### 服务端编译

当性能是关注点，服务端预编译你的模板比客户端要好。

* 编译引擎的文件大小三倍于渲染引擎的文件，因此每个页面你可以节省大约25kb的大小。

* 编译模板比渲染模板要慢的多。

编译器用Javascript写，使用Node.js，你可以使用dust的编译API构建你的模板，在内存中缓存它们。Java服务端可以使用[Nashorn](http://www.oracle.com/technetwork/articles/java/jf14-nashorn-2126515.html)渲染，这是JVM里的一个Javascript引擎。

如果你使用一个命令行构建工具，你可以使用内置的编译工具`dustc`，去编译你的模板。


### 服务端渲染

如果更多的关注性能，你可以考虑在服务端渲染你的模板，这意味着服务端将发送完整的HTML页面到客户端，而不是发送编译后的模板和模板需要的JSON数据。这对于移动端是个问题。这种方法的缺点是你不能在客户端用新数据重新渲染模板。
