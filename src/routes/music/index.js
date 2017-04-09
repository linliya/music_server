const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const request = require('request');

const User = require('../../models/user-model');
const Music = require('../../models/music-model');

const helper = require('../../helper');

router.use(bodyParser.json());


router.get('/music/:id', (req, res) => {
    let id = req.params.id;
    Music.findOne({id: id}, (err, music) => {
      // 数据库存在该歌曲
      if(music) {
        return res.send(music);
      }

      // 数据库中不存在,从接口获取
      let apiurl = 'http://music.163.com/api/song/detail?id='+ id +'&ids=%5B'+ id + '%5D';
      console.log(apiurl);
      let options = {
        headers: {cookie: 'appver=1.5.0.75771', referer: 'http://music.163.com'},
        url: apiurl,
        method: 'GET',
        json: true
      };

      function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            let music = {
              id: id,
              name: data.songs[0].name,
              singer: data.songs[0].artists[0].name,
              album: data.songs[0].album.name,
              playTime: data.songs[0].mMusic.playTime,
              playUrl: data.songs[0].mp3Url
            };

            Music.create(music)
              .then(() => {
                res.sendStatus(201);
              }, err => {
                res.sendStatus(500);
              });
            res.send(data);
        }
      }
      request(options, callback);
    });
});

// router.get('/music/lyric/:id', (req, res) => {
//     let id = req.params.id;
//     Music.findOne({id: id}, (err, music) => {
//       // 数据库存在该歌曲
//       if(music) {
//         return res.send(music);
//       }
//
//       // 数据库中不存在,从接口获取
//       let apiurl = 'http://music.163.com/api/song/lyric?os=pc&'+ id + '&lv=-1&kv=-1&tv=-1';
//       console.log(apiurl);
//       let options = {
//         headers: {cookie: 'appver=1.5.0.75771', referer: 'http://music.163.com'},
//         url: apiurl,
//         method: 'GET',
//         json: true
//       };
//
//       function callback(error, response, data) {
//         if (!error && response.statusCode == 200) {
//             res.send(data);
//         }
//       }
//       request(options, callback);
//     });
// });

router.get('/music', (req, res) => {
  Music.find({}).sort({_id: 1}).exec()
    .then(list => {
      res.json(list);
    }, err => {
      res.sendStatus(500);
    });
});


// router.delete('/music', (req, res) => {
//   Music.remove({ _id : /58e9eb610c5f9823de3bd09f/ } , function (err){
//   });
// })

module.exports = router;
