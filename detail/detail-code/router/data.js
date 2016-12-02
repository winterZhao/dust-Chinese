const dust = require('dustjs-linkedin');

// intro
var data1 = {
    "name": "friend",
    "familiarName": "pal"
}

// dot_notation
var data2 = {
    "name": "Ned",
    "amigo": {
        "name": "Dusty"
    }
}

// if例子（conditional）
var data3 = {
    isSelected: false,
    friends: ["Alice", "Bob"],
    enemies: ["Oscar"]
}

var data31 = {
    isSelected: true,
    friends: ["Alice", "Bob"]
}

// if/else 例子(else)
var data4 = {
    isPrimary: true
}
var data41 = {
    isPrimary: false
}

// 块体 (section)
var data5 = {
    "name": "John",
    "nickname": "Jingleheimer Schmidt",
    "friend": {
        "name": "Jacob"
    }
}

// 查找上下文 (reference_lookup)
var data6 = {
    "name": "John",
    "nickname": "Jingleheimer Schmidt",
    "friend": {
        "name": "Jacob"
    }
}

// 循环 (looper)
var data7 = {
    "languages": [
        "HTML",
        "CSS",
        "JavaScript",
        "Dust"
    ]
}

// 循环上下文,数组嵌套对象(loop_references)

var data8 = {
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

// 上下文 Context;
// 在父级查找(search-upwards)
var contextData1 = {
    "firstName": "John",
    "lastName": "Smith",
    "children": [
        { "firstName": "Alice" },
        { "firstName": "Bobby" },
        { "firstName": "Charlie" }
    ]
}
// 增加删除上下文(push)
var contextData2 = (function() {

    var context = dust.context();
    var newContext = context.push({ "foo": "bar", "one": { "two": "Hello!" } })
        .push("level2")
        .push("level3")
        .push("level4")
        .push("this one gets popped off");

    newContext.pop();

    return newContext;

})()

// 全局上下文(global)

var contextData3 = (function() {

    var context = dust.makeBase({ "global": "global", "name": "World" });

    return context.push({
        "friend": {
            "name": "Dusty"
        }
    });

}());
// 上下文帮助函数
var contextHelper1 = {
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

// 业务帮助函数(helpers_logic)
var dustHelper1 = {
    "level": "master",
    "age": 27,
    "starfighterRentalAge": 25
}

// 逻辑帮助函数的else(helpers_else)
var dustHelper2 = {
    "level": "padawan"
}

// 逻辑帮助函数的casting(helpers_casting)
var dustHelper3 = {
    "bilbosAge": 50,
    "gandalfsAge": 12345
}

// 分隔符选择器(grammatical-correctness)
var dustHelper4 = {
    "guests": ["Alice", "Bob", "Charlie"]
}

// 选择符选择器(helpers_select)
var dustHelper5 = {
    "testEnabled": "bunnies"
}

// 数学选择器(helpers_math)
var dustHelper6 = {
    "flavors": [
        { "name": "red bean" },
        { "name": "green tea" },
        { "name": "mango" },
        { "name": "peanut" }
    ]
}

// 输出数学选择器运算结果(helpers_math_output)
var dustHelper7 = {
    "progress": 70
}

// // 调试(helpers_contextdump)
var dustHelper8 = {
    "houses": {
        "gryffindor": {
            "founder": "Godric Gryffindor"
        },
        "hufflepuff": {
            "founder": "Helga Hufflepuff"
        }
    }
}

// // 调试(helpers_contextdump)
var partialData = {
    "isGreeting": true,
    "parks": [
        {
            "name": "Disneyland",
            "qualifier": "Happiest"
        },
        {
            "name": "Disney World Magic Kingdom",
            "qualifier": "Most Magical"
        }
    ]
}

// 语法 syntac(reference)
// 引用（reference）
var syntaxData1 = {
    "name": "name",
    "0name": "0name",
    "markup": "<span class=\"highlight\">Markup allowed</span>"
}

// 块体上下文
var syntaxData3 = {
  "name": "Jimmy",
  "extraData": {
    "name": "Kate"
  }
}

// 判断存在的块体上下文(exists)
var syntaxData4 = {
  "isReady": false
}

// 判断不存在的块体上下文(exists)
var syntaxData5 = {
  "isReady": false
}

// 帮助函数(helper)
var syntaxData6 = {
  "answer": 42
}

// 帮助函数(helper)
var syntaxData8 = {
  "isReady": "totally"
}


// 使用过滤器 Using FIlters
var filterData = {
    "title": '"All is <Fair> in Love & War"'
}


module.exports = {
    data1: data1,
    data2: data2,
    data3: data3,
    data31: data31,
    data4: data4,
    data41: data41,
    data5: data5,
    data6: data6,
    data7: data7,
    data8: data8,
    contextData1: contextData1,
    contextData2: contextData2,
    contextData3: contextData3,
    dustHelper1: dustHelper1,
    dustHelper2: dustHelper2,
    dustHelper3: dustHelper3,
    dustHelper4: dustHelper4,
    dustHelper5: dustHelper5,
    dustHelper6: dustHelper6,
    dustHelper7: dustHelper7,
    dustHelper8: dustHelper8,
    partialData: partialData,
    syntaxData1: syntaxData1,
    syntaxData3: syntaxData3,
    syntaxData4: syntaxData4,
    syntaxData5: syntaxData5,
    syntaxData6: syntaxData6,
    syntaxData8: syntaxData8,
    filterData: filterData
}
