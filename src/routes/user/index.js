const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");

const fm = require('formidable');
const fs = require('fs');
const path = require('path');

const crypto = require('crypto');

const User = require('../../models/user-model');
const helper = require('../../helper');

router.use(bodyParser.json());

// 用户登录
router.post('/user/login', (req, res, next) => {
  let userName = req.body.username;
  let password = req.body.password;

  //crypto模块功能是加密并生成各种散列,此处所示为MD5方式加密
  let md5 = crypto.createHash('md5');
  //加密后的密码
  let end_psw= md5.update(password).digest('hex');

  User.findOne({ username: userName }, function(err, user) {
    if (err) {
      res.sendStatus(404);
    }

    if (!user) {
      return res.sendStatus(404);
    }

    if (end_psw !== user.password) {
      return res.sendStatus(400);
    }

    let expires = Date.now() + 7*24*60*60*1000;
    let authToken = jwt.sign({
      expires: expires,
      username: userName,
      id: user._id
    }, "secret");

    res.status(200).json({
      expires: expires,
      token: authToken,
      username: userName,
      id: user._id
    });
  });

});

// 用户注册
router.post('/user/register', (req, res) => {
  let schema = {
    properties: {
      username: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    required: ['username', 'password']
  };
  // 获取意欲新增用户内容，并进行检验
  let newUser = req.body;
  let userName = newUser.username;
  let password = newUser.password;
  let [validated, errors] = helper.ajvCompileAndValid(schema, newUser);
  if (!validated) {
    res.sendStatus(400);
    return;
  }

  // 确认用户名是否已存在
  User.findOne({username: userName}, (err, user) => {
    if(err) {
      res.sendStatus(500);
    }

    let md5 = crypto.createHash('md5');   //crypto模块功能是加密并生成各种散列,此处所示为MD5方式加密
    let end_psw= md5.update(password).digest('hex');//加密后的密码

    newUser.password = end_psw;

    if(!user) {
      User.create(newUser)
        .then(() => {
          res.sendStatus(200);
        }, err => {
          res.sendStatus(500);
        });
    } else {
      res.sendStatus(403);
    }
  });
});

// 修改密码
router.put('/user/update_psw/:id', (req, res) => {
  let id = req.params.id;
  let oldPassword = req.body.old_password;
  let newPassword = req.body.new_password;

  let oldmd5 = crypto.createHash('md5');
  let newmd5 = crypto.createHash('md5');

  let end_old_psw= oldmd5.update(oldPassword).digest('hex');
  let end_new_psw= newmd5.update(newPassword).digest('hex');

  User.findById(id, (err, user) => {
    if(err) {
      return res.sendStatus(500);
    }

    if(!user) {
      // 用户不存在
      console.log('用户不存在');
      return res.sendStatus(404);
    }

    if(user.password !== end_old_psw) {
      return res.sendStatus(400);
    }

    User.findByIdAndUpdate(id, {$set:{password: end_new_psw}}).exec()
      .then(user => {
        res.sendStatus(204);
      }, err => {
        res.sendStatus(500);
        return;
      });
  })
});

// 上传用户头像
router.post('/user/upload/:id', (req, res) =>{
  let id = req.params.id;
  let form = new fm.IncomingForm();
  // 设置路径
  form.uploadDir = path.join(__dirname,'../../public/uploads')
  form.parse(req);
  form.on('end', () => {
    console.log('upload success');
  });

  form.on('file', (field, file) => {
    // 更改上传文件的名字
    fs.renameSync(file.path, path.join(form.uploadDir,'/' + id + '.png'))
    res.send(form.uploadDir + '/' + id + '.png');
  });
})

// 获取所有用户信息
router.get('/user', (req, res) => {
  User.find({}).sort({_id: 1}).exec()
    .then(list => {
      res.json(list);
    }, err => {
      res.sendStatus(500);
    });
});

// 新增用户
router.post('/user', (req, res) => {
  let schema = {
    properties: {
      username: {
        type: 'string'
      },
      password: {
        type: 'number'
      },
      name: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      tel: {
        type: 'string'
      }
    },
    required: ['username', 'password']
  };
  // 获取意欲新增用户内容，并进行检验
  let newUser = req.body;
  let [validated, errors] = helper.ajvCompileAndValid(schema, newUser);
  if (!validated) {
    res.status(400).json(errors);
    return;
  }

  // 用户名长度应介于6-16之间
  if(newUser.username.length < 6 || newUser.username.length > 16) {
    res.status(400).json(errors);
    return;
  }

  // 新增用户数据结构没问题，则进行数据库添加
  User.create(newUser)
    .then(() => {
      res.sendStatus(201);
    }, err => {
      res.sendStatus(500);
    });
});

router.get('/user/:id', (req, res) => {
  // 获取id
  let id = req.params.id;
  // 根据id进行查询并处理结果
  User.findById(id).exec()
    .then(user => {
      res.json(user);
    }, err => {
      console.error(err);
      res.sendStatus(404);
    });
});

// 删除用户
router.delete('/user/:id', (req, res) => {
  // 获取id
  let id = req.params.id;
  // 根据id进行数据的操作
  User.findByIdAndRemove(id).exec()
    .then(() => {
      res.sendStatus(204);
    }, err => {
      console.error(err);
      res.sendStatus(404);
    });
});

// 更新用户信息
router.put('/user/:id', (req, res) => {
  let schema = {
    properties: {
      username: {
        type: 'string'
      },
      password: {
        type: 'number'
      },
      name: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      tel: {
        type: 'string'
      }
    },
    required: ['username', 'password']
  };

  let id = req.params.id;
  let newUser = req.body;
  // 验证用户主体格式
  let [validated, errors] = helper.ajvCompileAndValid(schema, newUser);
  if (!validated) {
    res.sendStatus(400);
    return;
  }

  // 查找资源
  let user;
  User.findById(id).exec()
    .then(user => {
      user = json(user);
    }, err => {
      console.error(err);
      res.sendStatus(404);
      return;
    });

  // 更新资源
  User.findByIdAndUpdate(id, newUser).exec()
    .then(newUser => {
      res.json(newUser);
      res.sendStatus(204)
    }, err => {
      console.error(err);
      res.sendStatus(500);
      return;
    });

});

// router.delete('/user', (req, res) => {
//   User.remove({ username : /linli/ } , function (err){
//   });
// })

module.exports = router;
