const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const request = require('request');

const Playlist = require('../../models/playlist-model');

const helper = require('../../helper');

router.use(bodyParser.json());

router.get('/playlist/', (req, res) => {
    let order = req.query.order;
    let cat = req.query.category;

    let encode_cat = encodeURI(cat);

    let apiurl = 'http://music.163.com/api/playlist/list?cat=' + encode_cat + '&order='+ order +'&total=true&limit=1000';
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

// 首页歌单
router.get('/main/playlist', (req, res) => {
    let apiurl = 'http://music.163.com/api/playlist/list?cat=%E5%85%A8%E9%83%A8&order=hot&total=true&limit=10';
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

// 歌单详情
router.get('/playlist/:id', (req, res) => {
    let id = req.params.id;

      // 数据库中不存在,从接口获取
    let apiurl = 'http://music.163.com/api/playlist/detail?id='+ id;
    console.log(apiurl);
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

router.get('/playlistData', (req, res) => {
  Playlist.find({}).sort({_id: 1}).exec()
    .then(list => {
      res.json(list);
    }, err => {
      res.sendStatus(404);
    });
});
// router.delete('/store', (req, res) => {
//   Playlist.remove({} , function (err){
//   });
// })

module.exports = router;
