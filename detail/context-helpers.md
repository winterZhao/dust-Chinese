## 上下文帮助函数

### 为什么要使用上下文帮助函数?

假如你有一个监测应用，如果你想在模板里做逻辑测试，你可能这样写:

        {! Don't do this !}
        {@eq key="gearsTurning" value="true" type="boolean"}
          {@eq key="engineRunning" value="true" type="boolean"}
            {@eq key="onFire" value="false" type="boolean"}
              {@gt key="oilLevel" value="0.7"}
                Everything is awesome!
              {/gt}
            {/eq}
          {/eq}
        {/eq}

但是 2.0版本增加了一个新的测试，`gyroscopeIsActive`。你需要增加额外的嵌套条件判断。

3.0版本的每一个错误状态都会显示信息，你的模板正在失去控制!

这就是脚手架、或者上下文帮助函数（他们是同一个事物的不同名字）能帮助的。你的dust模板可以无限的包含像字符串、数字、数组这样的数据源。你也可以直接在上下文中包含函数，以提供新的数据或者转化已存在的数据。这意味着Dust上下文扮演者view models的角色。

使用脚手架，我们可以更简单的重写我们的模板。

        {#appStatusOK}
          Everything is awesome!
        {/appStatusOK}

在上下文中，将所有业务逻辑放到一个真正的Javascript函数里。

        {
          "appStatusOK": function() {
             return gearsTurning &&
                    engineRunning &&
                    !onFire &&
                    oilLevel > 0.7;
          }
        }

这样，即使你判断的条件发生改变了，你的模板也不用改变。

作为奖励，你的脚手架可以做的比模板更灵活。不用担心语法，后面我们会详细讲解它。

        // 检查app(monitor-app)
        {#appStatusOK}
          Everything is awesome!
          {:gearsError}
            Gears are stopped! Status code: {gears.error}
          {:engineError}
            Engine is not running! Engine temperature: {engine.temperature}
          {:oilLevelError}
            Oil level is too low! Current level: {engine.oilLevel}
        {/appStatusOK}

        // 数据源
        {
          "gears": {
            "status": "OK",
            "error": false
          },
          "engine": {
            "status": "OK",
            "error": false,
            "oilLevel": 0.5,
            "temperature": 80
          },
          "appStatusOK": function(chunk, context, bodies, params) {
             if(this.gears.error) {
               return chunk.render(bodies.gearsError, context);
             } else if(this.engine.error) {
               return chunk.render(bodies.engineError, context);
             } else if(this.engine.oilLevel < 0.7) {
               return chunk.render(bodies.oilLevelError, context);
             }
             return true;
          }
        }

        // 输出
        Oil level is too low! Current level: 0.5

### 写上下文帮助函数

#### 返回一个值

最简单的上下文帮助函数仅仅返回一个值,这个值被包含在上下文中。

        // 上下文帮助函数(friends)
        {#friends}{.} {/friends}{~n}
        {#friendsHelper}{.} {/friendsHelper}{~n}
        {?hasFriends}Yay friends!{/hasFriends}{~n}
        {?hasFriendsHelper}Yay friends!{/hasFriendsHelper}

        // 数据源
        {
          "friends": ["Alice", "Bob", "Charlie"],
          "friendsHelper": function() {
            return ["Alice", "Bob", "Charlie"];
          },
          "hasFriends": true,
          "hasFriendsHelper": function() {
            return this.friends.length > 0;
          }
        }

        // 输出
        Alice Bob Charlie
        Alice Bob Charlie
        Yay friends!
        Yay friends!


#### 与模板建立联系
模板和上下文通过向上下文帮助函数传递参数与之建立联系，一个完整的上下文帮助函数类似这样:

        function(chunk, context, bodies, params) {}


###### 数据块(Chunk)

上下文帮助函数可以访问模板的当前部分并且修改它。Dust中，这一部分叫做数据块(thunk)。返回数据块而不是一个值是告诉Dust你想手动覆盖原有的变量或者块级引用的输出。

        // 上下文帮助函数(friends)
        {#status}No Status Available!{/status}

        // 数据源
        {
          "hyperDriveStatus": "Warp Speed 9",
          "photonTorpedoCount": 800,
          "status": function(chunk) {
            return chunk.write("System Status\n".toUpperCase())
                        .write("Hyperdrive: " + this.hyperDriveStatus + "\n")
                        .write("Photon Torpedoes: " + this.photonTorpedoCount);
          }
        }

        // 输出
        SYSTEM STATUS
        Hyperdrive: Warp Speed 9
        Photon Torpedoes: 800

###### 上下文(Context)

上下文帮助函数可以读取传给模板的数据源的任一级别上下文，而不仅仅是当前上下文环境。

记住Dust上下文是对象实体的堆叠。Dust可以自由的穿越到任意上下文。更多有关上下文的，请看 [context](http://www.dustjs.com/guides/contexts/)

        // 穿越上下文(traverse-context)
        {#status}
          System Status: {#OK}OK!{:else}Horribly Wrong!{/OK}
        {/status}

        // 数据源
        {
          "engine": {
            "temperature": 180,
            "rpm": 3100
          },
          "flywheel": {
            "active": true
          },
          "status": {
            "OK": function(chunk, context) {
              var engineRPM = context.get(["engine", "rpm"]),
                  flywheelActive = context.get("flywheel.active");

              return (engineRPM < 9000) && flywheelActive;
            }
          }
        }

        // 输出
        System Status: OK!

****** 实体(Bodies)

正如你所见，Dust块级实体可能有条件地输出多个实体，最常见的一种是`{:else}`实体，你可能经常将它作为`{?exists}`块或者`{@eq}`帮助函数的一部分使用。

使用一个上下文帮助函数，你可以定义许多你自己的主体块。这让你把HTML和文本放在它们应该在的地方，而不是有条件的输出变量字符串作为你Javascript的一部分。

        // 逻辑(login)
        {#login}
          Welcome!
          {:usernameError}
          Your username was not found.
          {:passwordError}
          Your password was incorrect. You have {.} attempts remaining.
          {:else}
          Please log in!
        {/login}

        // 数据源
        (function() {

        function authorizeUser(username, password) {
          /* fake API - change the message and change the output! */
          return { message: "InvalidPassword",
                   loginAttemptsRemaining: 42 };
        }

        return {
          "login": function(chunk, context, bodies) {
            var username = context.get("username"),
                password = context.get("password"),
                status = authorizeUser(username, password);

            switch(status.message) {
              case "OK":
                return true;
              case "InvalidUserName":
                return chunk.render(bodies.usernameError, context);
              case "InvalidPassword":
                return chunk.render(bodies.passwordError,
                                    context.push(status.loginAttemptsRemaining));
            }

            return false;
          }
        };

        })();

        //输出
        Your password was incorrect. You have 42 attempts remaining.



###### 参数

像常规Dust块级引用一样，可以通过**params**传递参数给上下文帮助函数。


        // price
        {#price value=39.9 /}

        // 数据源
        {
          "price": function(chunk, context, bodies, params) {
            return chunk.write("$" + Number(params.value).toFixed(2));
          }
        }

        //输出
        $39.90

****** 分析参数
如果参数包含了一个Dust数据源引用，如果想在上下文帮助函数中使用它，你必须分析引用的数据源。使用`dust.helpers.tap()`可以完成引用分析。(这个方作为`dustjs-helpers`插件的一部分被提供)。

        // HELLO
        {#say text="Hello {name}!"/}

        // 数据源
        {
          "name": "lowercase person",
          "say": function(chunk, context, bodies, params) {
            var text = dust.helpers.tap(params.text, chunk, context);
            text = text.toUpperCase();
            return chunk.write(text);
          }
        }

        //输出
        HELLO LOWERCASE PERSON!



### 改变帮助函数的上下文
你可能只想在你的一部分上下文中调用你的帮助函数。在你的帮助函数后面增加一个冒号`:`以及一个上下文关键字们，可以实现这样的目的，像`{#helper:context}`。

        // greeting-bot
        {#greet:friends/}{~n}
        {#greet:acquaintances/}

        // 数据源
        {
          "friends": ["Alice", "Bob", "Charlie"],
          "acquaintances": ["Dusty", "Eggbert", "Fabrice"],
          "greet": function(chunk, context) {
            var people = context.current();
            return chunk.write("Hello " + people.join(" and ") + "!");
          }
        }

        //输出
        Hello Alice and Bob and s!
        Hello Dusty and Eggbert and Fabrice!

### 异步的上下文帮助函数

Dust的典型特征之一是它的异步性。异步的上下文帮助函数写法让你发HTTP请求或请求服务而不会阻塞你模板的渲染。

如果你有一个回调函数API，通过使用`chunk.map`，你可以告知dust在回调函数里渲染。

        // database
        {#query}{data}{/query}

        // 数据源
        (function() {
          function query(query, cb) {
            dust.nextTick(function() {
              cb(null, {data: "Dust"});
            });
          }
          return {
            "query": function(chunk, context, bodies, params) {
              return chunk.map(function(chunk) {
                query("SELECT name FROM USERS", function(err, data) {
                  return chunk.render(bodies.block, context.push(data))
                              .end();
                });
              });
            }
          };
        }())

        //输出
        Dust

使用`chunk.map`开始一个异步的代码的代码块。在它的回调函数里，你可以放任意的同步或者异步的操作，二者的唯一区别是你在执行时，你必须使用`chunk.end`作为异步操作执行完的标志。

你不能像正常的帮助函数的返回值那样返回一个异步的帮助函数返回值，你必须返回一个执行完的，已经`end`ed 的数据块(Chunk)。

###### Promise(Dust 2.6.2)

从Dust 2.6.2起，你的帮助函数可以返回Promise对象。当Promise完成后，Dust将打开Promise并添加它的对象到上下文中,因此你不用手动地映射数据块(Chunk)。

        // ip
        {#ip}Your IP address: {ip}{/ip}

        // 数据源
        {
          "ip": function(chunk, context, bodies, params) {
            return $.get("//ip.jsontest.com/");
          }
        }

        //输出
        Your IP address: 192.0.0.1

### 尝试

尝试下面的练习帮助你进一步理解上下文帮助函数。

#### 非格式化数据

你的JSON数据没有格式化，正如例子中那样，写一个帮助函数重新格式化数据以使模板正常工作。

        // 格式化数据
        {#friends}
          {name} - {birthday}{~s}
        {/friends}

        //
        {
          "people": ["Alice", "Bob", "Charles"],
          "birthdays": {
            "Alice": "12/01/84",
            "Bob": "08/30/66",
            "Charles": "07/07/77"
          },
          "friends": function(chunk, context, bodies, params) {
            var friends = [],
                people = context.get("people"),
                birthdays = context.get("birthdays");

            people.forEach(function(person) {
              chunk.render(bodies.block, context.push({
                "name": person,
                "birthday": birthdays[person]
              }));
            });
          }
        }

        // 输出
        Alice - 12/01/84 Bob - 08/30/66 Charles - 07/07/77


#### 转化温度

我们的天气预报的温度通常是华氏温标，但我们需要展示位摄氏温标。

转化公式是:

(F - 32) * 5/9

        // 温度转化
        {#convertToCelsius temperatureF="68" /}

        // 数据源
        {
         "convertToCelsius": function(chunk, context, bodies, params) {
           var f = params.temperatureF,
               c = (f - 32) * 5/9;
           return chunk.write(c);
         }
        }

        // 输出
        20

###### 加分项

将你的温度转化帮助函数进行改造，使得传入`c`或者`f`参数，可以输出另一个温度。


#### 跑步冠军

我们列举了一系列的运动员和他们的跑步时间，但是我们展示他们是为了让我们知道谁赢得比赛。

        // 跑步结果
        {#orderedRacers}
          {name} - {time} minutes{~s}
        {/orderedRacers}

        // 数据源
        {
          "racers": [
            { "name": "Mario", time: 5.8 },
            { "name": "Bowser", time: 4.9 },
            { "name": "Peach", time: 5.1 },
            { "name": "Daisy", time: 7 },
            { "name": "Toad", time: 5.2 }
          ],
          "orderedRacers": function(chunk, context, bodies, params) {
            var racers = context.get("racers");
            racers.sort(function(a, b) {
              return a.time - b.time;
            });
            return racers;
          }
        }

        // 输出
        Bowser - 4.9 minutes Peach - 5.1 minutes Toad - 5.2 minutes Mario - 5.8 minutes Daisy - 7 minutes

###### 加分项

写一个秒帮助函数，作用是获取上下文中的`{time}`分钟数,将它格式化为分，秒，并且在你的列表中体现出来。

"minutesSeconds": function(chunk, context, bodies, params) {
  var time = context.get("time"),
      minutes = Math.floor(time),
      seconds = Math.round((time - minutes) * 60);

  if(minutes) { chunk.write(minutes + "m"); }
  if(seconds) { chunk.write(seconds + "s"); }
  return chunk;
}