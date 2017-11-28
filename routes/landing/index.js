var conf = require('../../config/app.js');
var express = require('express');
var router = express.Router();
var pug = require('pug');

router.get('/', function(req, res, next) {
  var data = conf.pug;
  data.lang = jsonfile.readFileSync("lang/"+req.lang+".json");;
  data.timestamp = Math.floor(Date.now() / 1000);
  var html = pug.renderFile('./views/index.pug',data);
  res.send(html);
});

router.get('/:campaign',function(req,res){
  var data = conf.pug;
  data.lang = jsonfile.readFileSync("lang/"+req.lang+".json");
  data.timestamp = Math.floor(Date.now() / 1000);
  var html = pug.renderFile('./views/landing/'+req.params.campaign+'.pug',data);
  res.send(html);
});


module.exports = router;
