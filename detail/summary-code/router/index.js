

const router = require('koa-router')();


const data = {
    'name': 'zhangsan',
    'age': 23,
    'hobbies': ['足球', '篮球', '乒乓球'],
    'eat': {
        'breakfast': '八点',
        'lunch': '十二点',
        'dinner': '十九点'
    }
}

module.exports = function(app) {


    router.get('/', function*(){
        yield this.render('index.dust',{
            data: data
        });
    });




    app.use(router.routes())
        .use(router.allowedMethods());
};
