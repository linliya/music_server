const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const User = require('../../models/user-model');
const helper = require('../../helper');

router.use(bodyParser.json());

router.get('/users', (req, res) => {
  User.find({}).sort({name: 'asc'}).exec()
    .then(list => {
      res.json(list);
    }, err => {
      res.status(500).json(err);
    });
});

// 新增用户
router.post('/users', (req, res) => {
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

router.get('/users/:id', (req, res) => {
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
router.delete('/users/:id', (req, res) => {
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
router.put('/users/:id', function(req, res) {
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
    });

  // 更新资源
  User.findByIdAndUpdate(id, newUser).exec()
    .then(newUser => {
      res.json(newUser);
      res.status = 204;
    }, err => {
      console.error(err);
      res.sendStatus(500);
    });

});

module.exports = router;