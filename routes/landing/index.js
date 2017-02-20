var conf = require('../../config/app.js');
var express = require('express');
var router = express.Router();
var pug = require('pug');

router.get('/', function(req, res, next) {
  const lang = require('../../lang/es_ES.js');
  var data = conf.pug;
  data.lang = lang;
  var html = pug.renderFile('./views/index.pug',data);
  res.send(html);
});

router.get('/:campaign',function(req,res){
  const lang = require('../../lang/es_ES.js');
  var data = conf.pug;
  data.lang = lang;
  var html = pug.renderFile('./views/landing/'+req.params.campaign+'.pug',data);
  res.send(html);
});


module.exports = router;
