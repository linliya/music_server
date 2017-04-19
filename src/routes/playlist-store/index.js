const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const request = require('request');

const PlaylistStore = require('../../models/playlist-store-model.js');

const helper = require('../../helper');


//收藏歌单
router.post('/store/add', (req, res) => {
  console.log(req.body);
  let data = req.body;

  let playlist = {
    id: data.id,
    userId: data.userId,
    result: data.result
  };

  PlaylistStore.create(playlist)
    .then(() => {
      // console.log(playlist);
      res.sendStatus(201);
    }, err => {
      res.sendStatus(404);
    });
});

// 创建歌单
router.post('/store/create', (req, res) => {
  let playlist = req.body;

  PlaylistStore.create(playlist)
    .then(() => {
      res.sendStatus(201);
    }, err => {
      console.log(err);
      res.sendStatus(500);
    })
});

// 获取歌单
router.get('/store/:id', (req, res) => {
  let id = req.params.id;

  PlaylistStore.find({userId: id}).exec()
    .then(list => {
      res.send(list);
    }, err => {
      res.sendStatus(404);
    });
});

// 删除歌单
router.delete('/store/delete/:id', (req, res) => {
  let id = req.params.id;

  PlaylistStore.remove({id: id}).exec()
    .then(() => {
      console.log('删除成功');
      res.sendStatus(204);
    }, err => {
      res.sendStatus(404);
    })
});

// 删除全部歌单
router.delete('/store', (req, res) => {
  PlaylistStore.remove({} , function (err){
  });
});


module.exports = router;
