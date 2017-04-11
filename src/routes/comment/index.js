const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const request = require('request');

const Comment = require('../../models/comment-model');

const helper = require('../../helper');

router.use(bodyParser.json());

// 添加评论
router.post('/comment/add/:id', (req, res) => {
  let id = req.params.id;
  let comment = req.body;

  Comment.create(comment)
    .then(() => {
      res.sendStatus(200);
      console.log('add success');
    }, err => {
      res.sendStatus(500);
    });
});

router.get('/comment/:id', (req, res) => {
  let id = req.params.id;

  Comment.find({id: id}).exec()
    .then(comment => {
      res.send(comment);
    }, err => {
      res.sendStatus(404);
    });
});

// router.delete('/comment', (req, res) => {
//   Comment.remove({ commentUser : /linli/ } , function (err){
//   });
// })


module.exports = router;
