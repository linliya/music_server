const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const request = require('request');

const Playlist = require('../../models/playlist-model');

const helper = require('../../helper');

router.use(bodyParser.json());

router.get('/playlist/all/:order', (req, res) => {
    let order = req.params.order;
    let apiurl = 'http://music.163.com/api/playlist/list?cat=%E5%85%A8%E9%83%A8&order='+ order +'&total=true&limit=1000';
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
    // Playlist.findOne({id: id}, (err, playlist) => {
    //   // 数据库存在该歌曲
    //   if(playlist) {
    //     return res.send(playlist);
    //   }

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
            // let playlist = {
            //   id: id,
            //   name: data.name,
            //   author: data.result.creator.nickname
            //   pic: data.result.creator.backgroundUrl
            // };
            //
            // Playlist.create(playlist)
            //   .then(() => {
            //     res.sendStatus(201);
            //   }, err => {
            //     res.sendStatus(500);
            //   });
            res.send(data);
        }
      }
      request(options, callback);
    // });
});

module.exports = router;
