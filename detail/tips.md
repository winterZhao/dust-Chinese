## 技巧

### 逻辑

[Dust核心逻辑帮助函数](https://github.com/linkedin/dustjs-helpers)为模板提供大多数应用需要的基础逻辑。帮助函数包括逻辑上的比较(等于，小于，大于)，简单的数学运行，以及其他。

尽管Dust不是完成的无逻辑的，以便你可以应对一些基础的障碍。但Dust不希望被太多的业务逻辑所环绕。如果有太多的逻辑，Dust模板将很难阅读，也很难去维护。这也将增加维护你的模板的困难程度。让服务端处理业务逻辑，或者写[Context Helpers](http://www.dustjs.com/guides/context-helpers/)移动业务逻辑到模板外。

### 调试

在你渲染模板前,可以通过设置`dust.debugLevel`为'DEBUG','INFO','WARN',或者'ERROR'开启调试模式。

* 'DUBUG'：将不会过滤掉任何日志信息，而在其上的每个等级将会将会输出日志

* 'DEBUG'和'INFO'信息将会帮助你调试模板行为，但是可以忽略。

* 'WARN'信息通知你意料之外的不会导致你的模板渲染失败的行为。

* 'ERROR'信息是至关重要的，表示你的模板渲染失败。

* 开发环境中，输出日志到'WARN'和'INFO'将帮助你捕捉模板问题。

        if (process.env.NODE_ENV === 'development') {
          dust.debugLevel = "INFO";
        }


当在命令行运行Node应用服务时，你可以通过设置`dust`的环境变量为`DEBUG`,以自动开始调试模式。


### 检查(Linting)

你可以运行[Swiffer](https://github.com/smfoote/Swiffer.js),Dust代码检查工具，得到关于安全漏洞、解析错误以及代码风格指导的警告。