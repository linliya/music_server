const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const request = require('request');

const fm = require('formidable');
const fs = require('fs');
const path = require('path');

const MusicUpload = require('../../models/music-upload-model.js');

router.use(bodyParser.json());

// 上传音乐文件
router.post('/upload/music/:id', (req, res) => {
  let id = req.params.id;
  let arr = [];

  let form = new fm.IncomingForm();
  form.uploadDir = path.join(__dirname,'./upload')
  form.parse(req);

  form.on('error', (err) => {
    console.log(err);
  });

  form.on('file', (field, file) => {
    arr[field] = file.name;
    fs.renameSync(file.path, path.join(form.uploadDir, file.name));
  });

  form.on('field', function(field, value) {
    arr[field] = value;
  });

  form.on('end', () => {
    let filePath = path.join(form.uploadDir, arr['file']);
    let data = {
      id: id,
      name: arr['name'],
      singer: arr['singer'],
      file: filePath
    }

    MusicUpload.findOne({name: data.name}, (err, music) => {
      if(err) {
        return res.sendStatus(500);
      }

      if(music) {
        return res.sendStatus(400);
      }

      if(!music) {
        MusicUpload.create(data)
          .then(() => {
            res.sendStatus(201);
          }, err => {
            res.sendStatus(500);
          })
      }
    })
  })
});

router.get('/upload/music', (req, res) => {
  let id = req.params.id;

  MusicUpload.find({}).exec()
    .then( list => {
      res.send(list);
    }, err => {
      console.log(err);
      res.sendStatus(500);
    })
});

router.delete('/upload/music/:id', (req, res) => {
  MusicUpload.remove({} , function (err){
  });
});


module.exports = router;
