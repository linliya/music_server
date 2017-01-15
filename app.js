var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var app = express();

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'bower_components')));
app.listen(port);

console.log('music started on port:' + port);

app.get('/', function(res, res) {
  res.render('index', {
    title: 'music 首页',
    music: [{
      title: '不能说的秘密',
      _id: 1,
      poster: 'http://image.baidu.com/search/detail?ct=503316480&z=0&ipn=false&word=%E5%91%A8%E6%9D%B0%E4%BC%A6%E5%9B%BE%E7%89%87&step_word=&hs=0&pn=11&spn=0&di=35104461590&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=0&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=undefined&cs=1329748034%2C817637268&os=1571168913%2C1247513366&simid=56487165%2C816773329&adpicid=0&lpn=0&ln=3972&fr=&fmq=1484410187811_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=&height=&face=undefined&ist=&jit=&cg=star&bdtype=0&oriquery=&objurl=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201410%2F23%2F20141023212048_BvG4B.jpeg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3B17tpwg2_z%26e3Bv54AzdH3Frj5rsjAzdH3F4ks52AzdH3Fd9b89nn88AzdH3F1jpwtsAzdH3F&gsm=0&rpstart=0&rpnum=0'
    }, {
      title: '安静',
      _id: 2,
      poster: 'http://image.baidu.com/search/detail?ct=503316480&z=0&ipn=false&word=%E5%91%A8%E6%9D%B0%E4%BC%A6%E5%9B%BE%E7%89%87&step_word=&hs=0&pn=11&spn=0&di=35104461590&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=0&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=undefined&cs=1329748034%2C817637268&os=1571168913%2C1247513366&simid=56487165%2C816773329&adpicid=0&lpn=0&ln=3972&fr=&fmq=1484410187811_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=&height=&face=undefined&ist=&jit=&cg=star&bdtype=0&oriquery=&objurl=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201410%2F23%2F20141023212048_BvG4B.jpeg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3B17tpwg2_z%26e3Bv54AzdH3Frj5rsjAzdH3F4ks52AzdH3Fd9b89nn88AzdH3F1jpwtsAzdH3F&gsm=0&rpstart=0&rpnum=0'

    }

    ]
  });
});

app.get('/music/:id', function(res, res) {
  res.render('detail', {
    title: 'music 详情页'
  });
});

app.get('/admin/music', function(res, res) {
  res.render('admin', {
    title: 'music 后台录入页'
  });
});
