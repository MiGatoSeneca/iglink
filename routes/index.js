var conf = require('../config/app.js');
var express = require('express');
var router = express.Router();
var pug = require('pug');
var getUrls = require('get-urls');
var request = require("request")

router.get('/', function(req, res, next) {
  const lang = require('../lang/es_ES.js');
  var data = conf.pug;
  data.lang = lang;
  var html = pug.renderFile('./views/index.pug',data);
  res.send(html);
});


router.get('/:username',function(req,res){
  var data = {
    url: "https://www.instagram.com/"+req.params.username+"/?__a=1",
    json: true
  };
  request(data,function(error, response, data){
    const lang = require('../lang/es_ES.js');
    var url_found=false;
    var count = 1;
    if (!error && response.statusCode === 200) {
      var posts = new Array();
      var iguser = {};
      iguser.avatar=data.user.profile_pic_url;
      var igposts = data.user.media.nodes;
      if(typeof igposts != "undefined"){
        for ( var igpost of igposts){
          if(typeof igpost.caption != "undefined"){
            igpost.caption = igpost.caption.replace(/\n/g, " ");
            urls = getUrls(igpost.caption);
            var url = "";
            for ( var url of urls){
              if(url!=""){
                igpost.url=url;
                igpost.count=count;
                count++;
                posts.push(igpost);
                url_found=true;
              }
            }
          }
        }
      }
    }
    var data = conf.pug;
    data.lang = lang;
    data.username = req.params.username;

    if(url_found){
      data.posts = posts;
      data.avatar = iguser.avatar;
      var html = pug.renderFile('./views/redirection/index.pug',data);
    }else{
      var html = pug.renderFile('./views/redirection/error/index.pug',data);
    }
    res.send(html);
  });
});


module.exports = router;
