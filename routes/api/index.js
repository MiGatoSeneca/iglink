var conf = require('../../config/app.js');
var express = require('express');
var router = express.Router();

router.get('/version',function(req,res){
  var response={
    "version":conf.version
  };
  res.status(200).jsonp(response);
});


module.exports = router;
