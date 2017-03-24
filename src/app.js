const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const config = require('../config.json');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");

const app = express();

//连接数据库
mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`, err => {
  if (err) {
    console.error(`连接mongo出错：${err}`);
    process.exit(1);
  }
});

// 解决跨域问题
app.use(cors());
app.use(bodyParser());

// 创建静态文件public
app.use(express.static(path.join(__dirname,'public')));

app.use(expressJwt({
  secret: "secret",
  getToken: function fromHeader(req) {
    if (req.headers.authorization.split(' ')[0] === 'Token') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
}).unless({path: ["/user/login","/user/register", "/user"]}));

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("invalid token");
  }
});


// 添加中间件
app.use(userRouter);

app.get('/user/update/:id', function(req, res) {
  let token = req.headers.authorization;
  console.log(token);
  // if(token) {
  //   User.find({}).sort({_id: 1}).exec()
  //     .then(list => {
  //       res.json(list);
  //     }, err => {
  //       res.status(500).json(err);
  //     });
  // }
  // res.sendStatus(401);
})

app.listen(3000, () => {
  console.log('Server listening 3000...');
});
