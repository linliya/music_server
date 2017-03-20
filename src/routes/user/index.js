
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const User = require('../../models/user-model');
const helper = require('../../helper');

router.use(bodyParser.json());

// 用户登录
router.post('/user/login', (req, res) => {
  let userName = req.body.username;
  let password = req.body.password;

    User.findOne({username: userName})
      .exec()
      .then(user => {
        if(password == user.password) {
          let user1 = {username: user.username};
          console.log('密码相同');
          if(req.session.user) {
            console.log('存在session');
            res.send(req.session.user);
            res.end();
          }
          else {
            req.session.user = user1;
            res.send(req.session.user);
            res.end();
          }
        } else {
          res.sendStatus(400);
          return;
        }
      })

      .catch(err => {
        req.session.error = "用户名不存在";
        res.sendStatus(404);
        return;
      })
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
  let [validated, errors] = helper.ajvCompileAndValid(schema, newUser);
  if (!validated) {
    res.status(400).json(errors);
    return;
  }

  // 确认用户名是否已存在
  // User.findOne({username: userName}).exec()
  //   .then(user => {
  //     res.status(403).json(errors);
  //   });

  // 新增用户数据结构没问题，则进行数据库添加
  User.create(newUser)
    .then(() => {
      res.send({username: newUser.username});
    }, err => {
      res.status(500).json(err);
    });
});

router.delete('/user/logout', (req, res) => {
  req.session.user = null;
  res.sendStatus(204);
});

// 获取所有用户信息
router.get('/user', (req, res) => {
  User.find({}).sort({_id: 1}).exec()
    .then(list => {
      res.json(list);
    }, err => {
      res.status(500).json(err);
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
      res.send(201);
    }, err => {
      res.status(500).json(err);
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
    res.status(400).json(errors);
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
      res.status = 204;
    }, err => {
      console.error(err);
      res.sendStatus(500);
      return;
    });

});

// router.delete('/user', (req, res) => {
//   User.remove({ username : // } , function (err){
//   });
// })

module.exports = router;
