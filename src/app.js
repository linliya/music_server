const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const musicRouter = require('./routes/music');
const playlistRouter = require('./routes/playlist');
const commentRouter = require('./routes/comment');
const playlistStoreRouter = require('./routes/playlist-store');
const musicUploadRouter = require('./routes/music-upload');

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

app.use(bodyParser.json({limit: '50mb'}));

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
}).unless({path: ["/user/login","/main/playlist", "/user"]}));

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.sendStatus(401);
  }
  next();
});


// 添加中间件
app.use(userRouter);
app.use(musicRouter);
app.use(commentRouter);
app.use(playlistRouter);
app.use(playlistStoreRouter);
app.use(musicUploadRouter);

app.listen(3000, () => {
  console.log('Server listening 3000...');
});
