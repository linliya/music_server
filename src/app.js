const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const config = require('../config.json');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
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

app.use(expressJwt({secret: "secret"}).unless({path: ["/user/login"]}));
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("invalid token");
  }
});


// 添加中间件
app.use(userRouter);

app.listen(3000, () => {
  console.log('Server listening 3000...');
});
