const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// const Music = require('./models/music');
const userRouter = require('./routes/user');
const config = require('../config.json');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
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
// body parser
app.use(bodyParser());

app.use(cookieParser());

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*10
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  // let err = req.session.error;
  // res.locals.message = '';
  // if(err) {
  //   res.locals.message = err;
  // }
  next();
});
// 添加中间件
app.use(userRouter);

app.listen(3000, () => {
  console.log('Server listening 3000...');
});
