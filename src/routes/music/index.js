const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const request = require('request');

const User = require('../../models/user-model');
const Music = require('../../models/music-model');
const PlaylistStore = require('../../models/playlist-store-model');

const helper = require('../../helper');

router.use(bodyParser.json());

router.get('/music/:id', (req, res) => {
    let id = req.params.id;
    Music.findOne({id: id}, (err, music) => {
      // 数据库中不存在,从接口获取
      let apiurl = 'http://music.163.com/api/song/detail?id='+ id +'&ids=%5B'+ id + '%5D';
      let options = {
        headers: {cookie: 'appver=1.5.0.75771', referer: 'http://music.163.com'},
        url: apiurl,
        method: 'GET',
        json: true
      };

      function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            res.send(data);
        }
      }
      request(options, callback);
    });
});

// 获取专辑详情
router.get('/albums/:id', (req, res) => {
    let id = req.params.id;
    let apiurl = 'http://music.163.com/api/album/'+ id +'?ext=true&id='+ id +'&offset=0&total=true&limit=10';
    let options = {
      headers: {cookie: 'appver=1.5.0.75771', referer: 'http://music.163.com'},
      url: apiurl,
      method: 'GET',
      json: true
    };

    function callback(error, response, data) {
      if (!error && response.statusCode == 200) {

          res.send(data);
      }
    }
    request(options, callback);
});

router.get('/music/lyric/:id', (req, res) => {
    let id = req.params.id;
    let apiurl = 'http://music.163.com/api/song/lyric?os=pc&id='+ id + '&lv=-1&kv=-1&tv=-1';
    let options = {
      headers: {cookie: 'appver=1.5.0.75771', referer: 'http://music.163.com'},
      url: apiurl,
      method: 'GET',
      json: true
    };

    function callback(error, response, data) {
      if (!error && response.statusCode == 200) {
          res.send(data);
      }
    }
    request(options, callback);
});

router.get('/download/:id', (req, res) => {
  let id = req.params.id;
  let apiurl = 'http://music.163.com/api/song/enhance/download/url?br=320000&id=' + id;
  let options = {
    headers: {cookie: 'appver=1.5.0.75771', referer: 'http://music.163.com'},
    url: apiurl,
    method: 'GET',
    json: true
  };

  function callback(error, response, data) {
    if (!error && response.statusCode == 200) {
        res.send(data);
    }
  }
  request(options, callback);
});

router.get('/music', (req, res) => {
  Music.find({}).sort({_id: 1}).exec()
    .then(list => {
      res.json(list);
    }, err => {
      res.sendStatus(500);
    });
});

router.post('/store/add/song', (req, res) => {
  let playlistName = req.body.playlist;
  let music = req.body.music;
  let data;

  PlaylistStore.findOne({name: playlistName}, (err, playlist) => {
    if(err) {
      return res.sendStatus(500);
    }

    if(!playlist) {
      return res.sendStatus(404);
    }

    if(playlist) {
      for(let i = 0;i < playlist.result.tracks.length; i++) {
        if(playlist.result.tracks[i].name === music.name) {
          return res.sendStatus(400);
        }
      }

      playlist.result.tracks.push(music);
      PlaylistStore.update({name: playlistName}, playlist, (err, data) => {
        if (err) {
          console.log("Error:" + err);
        }
        else {
          res.sendStatus(201);
        }
      })
    }
  })
});

// router.delete('/music', (req, res) => {
//   Music.remove({ singer : /陈/ } , function (err){
//   });
// })

module.exports = router;
