const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const config = require('../config.json');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
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

app.use(cookieParser('secret'));

app.use(session({
  name: 'sid',
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  // store: new mongoStore({url: 'mongodb://127.0.0.1:27017/session'}),
  cookie: {
    maxAge: 1000*60*1000
  }
}));
// 添加中间件
app.use(userRouter);

app.listen(3000, () => {
  console.log('Server listening 3000...');
});
