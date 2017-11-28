var conf = require('../config/app.js');
var express = require('express');
var router = express.Router();
var pug = require('pug');
var getUrls = require('get-urls');
var request = require("request")
var emojiStrip = require('emoji-strip');
var jsonfile = require('jsonfile');
var fs = require('fs');

router.get('/', function(req, res, next) {
  var data = conf.pug;
  data.lang = jsonfile.readFileSync("lang/"+req.lang+".json");
  data.timestamp = Math.floor(Date.now() / 1000);
  var html = pug.renderFile('./views/index.pug',data);
  res.send(html);
});

function getRequest(req,res,attempt){
  
  if(attempt<=5){
    
    request(data,function(error, response, data){
      var count = 1;
      var posts_count = 0;
      var last_id = null;
      var url_found = false;
      
      if (!error && response.statusCode === 200) {
        var posts = new Array();
        var iguser = {};
        iguser.avatar=data.user.profile_pic_url;
        iguser.avatarhd=data.user.profile_pic_url_hd;
        var igposts = data.user.media.nodes;
        if(typeof igposts != "undefined"){
          for ( var igpost of igposts){
            if(typeof igpost.caption != "undefined"){
              igpost.caption = igpost.caption.replace(/\n/g, " ");
              igpost.caption=emojiStrip(igpost.caption);
              urls = getUrls(igpost.caption,{stripWWW:false});
              var url = "";
              var post_url_found = false;
              for (var url of urls){
                if((url!="")&&(!post_url_found)){
                  igpost.url=url;
                  igpost.count=count;
                  posts_count++;
                  count++;
                  posts.push(igpost);
                  url_found = true;
                  post_url_found = true;
                }
              }
  
            }
            last_id=igpost.id;
          }
         if(data.user.media.page_info.has_next_page){
            last_id=data.user.media.page_info.end_cursor;          
          }
        }
        var data = conf.pug;
        data.lang = jsonfile.readFileSync("lang/"+req.lang+".json");
        data.username = req.params.username;
        data.posts = {};
        data.avatar = iguser.avatar;
        data.avatarhd = iguser.avatarhd;
        data.last_id = last_id;
        data.posts_count = posts_count;
        data.timestamp = Math.floor(Date.now() / 1000);
        if(url_found){
          data.posts = posts;
        }
        var html = pug.renderFile('./views/redirection/index.pug',data);
        res.send(html);
      }else{
        getRequest(req,res,attempt+1);
      }
    });
    
  }else{
    var data = conf.pug;
    data.lang = jsonfile.readFileSync("lang/"+req.lang+".json");
    data.username = req.params.username;
    var html = pug.renderFile('./views/redirection/error/index.pug',data);
    res.send(html);
  }
  
  
}

router.get('/:username',function(req,res){
  
  console.log("["+req.params.username+"][referer::"+req.headers.referer+"]");
  console.log(req.headers);
  
  var data = {
    url: "https://www.instagram.com/"+req.params.username+"/?__a=1",
    json: true
  };
 
  request(data,function(error, response, data){
    
    var count = 1;
    var posts_count = 0;
    var last_id = null;
    var url_found = false;
    
    if (!error && response.statusCode === 200) {
      var posts = new Array();
      var iguser = {};
      iguser.avatar=data.user.profile_pic_url;
      iguser.avatarhd=data.user.profile_pic_url_hd;
      var igposts = data.user.media.nodes;
      if(typeof igposts != "undefined"){
        for ( var igpost of igposts){
          if(typeof igpost.caption != "undefined"){
            igpost.caption = igpost.caption.replace(/\n/g, " ");
            igpost.caption=emojiStrip(igpost.caption);
            urls = getUrls(igpost.caption,{stripWWW:false});
            var url = "";
            var post_url_found = false;
            for (var url of urls){
              if((url!="")&&(!post_url_found)){
                igpost.url=url;
                igpost.count=count;
                posts_count++;
                count++;
                posts.push(igpost);
                url_found = true;
                post_url_found = true;
              }
            }

          }
          last_id=igpost.id;
        }
       if(data.user.media.page_info.has_next_page){
          last_id=data.user.media.page_info.end_cursor;          
        }
      }
      var data = conf.pug;
      data.lang = jsonfile.readFileSync("lang/"+req.lang+".json");
      data.username = req.params.username;
      data.posts = {};
      data.avatar = iguser.avatar;
      data.avatarhd = iguser.avatarhd;
      data.last_id = last_id;
      data.posts_count = posts_count;
      data.timestamp = Math.floor(Date.now() / 1000);
      if(url_found){
        data.posts = posts;
      }
      var html = pug.renderFile('./views/redirection/index.pug',data);
      res.send(html);
    }else{
      var data = conf.pug;
      data.lang = jsonfile.readFileSync("lang/"+req.lang+".json");
      data.username = req.params.username;
      var html = pug.renderFile('./views/redirection/error/index.pug',data);
      res.send(html);
    }
  });
  
});

router.get('/test/:username',function(req,res){
  var data = {
    url: "https://www.instagram.com/"+req.params.username+"/?__a=1",
    json: true
  };
  request(data,function(error, response, data){
    var reload = true;
    if(req.query.reload === undefined){
      reload=false;
    }
    const lang = require('../lang/es_ES.json');
    var url_found=false;
    var count = 1;
    if (!error && response.statusCode === 200) {
      var posts = new Array();
      var iguser = {};
      iguser.avatar=data.user.profile_pic_url;
      iguser.is_ready=false;
      var igposts = data.user.media.nodes;
      if(typeof igposts != "undefined"){
        for ( var igpost of igposts){
          if(typeof igpost.caption != "undefined"){
            igpost.caption = igpost.caption.replace(/\n/g, " ");
            urls = getUrls(igpost.caption);
            var url = "";
            var has_url = false;
            for (var url of urls){
              if(url!=""){
                igpost.url=url;
                igpost.count=count;
                igpost.has_url=true;
                iguser.is_ready=true;
                count++;
                posts.push(igpost);
                has_url=true;
              }
            }
            if(!has_url){
              igpost.url=url;
              igpost.count=count;
              igpost.has_url=false;
              count++;
              posts.push(igpost);
            }
          }
        }
      }
      var data = conf.pug;
      data.lang = jsonfile.readFileSync("lang/"+req.lang+".json");
      data.reload = reload;
      data.username = req.params.username;
      data.is_ready=iguser.is_ready;
      data.posts = posts;
      data.avatar = iguser.avatar;
      data.timestamp = Math.floor(Date.now() / 1000);
//      data.end_cursor = Math.floor(Date.now() / 1000);
      var html = pug.renderFile('./views/redirection/test/index.pug',data);
      res.send(html);
    }else{
      var data = conf.pug;
      data.lang = jsonfile.readFileSync("lang/"+req.lang+".json");
      data.timestamp = Math.floor(Date.now() / 1000);
      var html = pug.renderFile('./views/redirection/test/error.pug',data);
      res.send(html);
    }
  });
});


module.exports = router;
