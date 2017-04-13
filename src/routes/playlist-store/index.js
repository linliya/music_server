const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const request = require('request');

const PlaylistStore = require('../../models/playlist-store-model.js');

const helper = require('../../helper');

router.use(bodyParser.json());

//收藏歌单
router.post('/store/add', (req, res) => {
  let data = req.body;

  let playlist = {
    userId: data.userId,
    id: data.playlistId,
    name: data.playlistName,
    author: data.playlistCreator,
    pic: data.playlistPic,
    bg: data.playlistCreatorBg,
    tracks: data.playlistSongs,
    createTime: data.playlistCreateTime,
    playCount: data.playCount
  };

  PlaylistStore.create(playlist)
    .then(() => {
      console.log('add success');
      res.sendStatus(201);
    }, err => {
      res.sendStatus(404);
    });
});

router.get('/store/:id', (req, res) => {
  let id = req.params.id;

  PlaylistStore.find({userId: id}).exec()
    .then(list => {
      console.log(list);
      res.send(list);
    }, err => {
      res.sendStatus(404);
    });
});

router.delete('/store', (req, res) => {
  PlaylistStore.remove({} , function (err){
  });
});


module.exports = router;
