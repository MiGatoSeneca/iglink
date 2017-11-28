var conf = require('../../config/app.js');
var express = require('express');
var router = express.Router();
var request = require("request")
var getUrls = require('get-urls');
var getEmails = require('get-emails');
var whoisParser = require('parse-whois');
var whois = require('whois');
var emojiStrip = require('emoji-strip');


router.get('/version',function(req,res){
  var response={
    "version":conf.version
  };
  res.status(200).jsonp(response);
});

router.get('/:username/:id',function(req,res){
  
  var data = {
    url: "https://www.instagram.com/"+req.params.username+"/?__a=1&max_id="+req.params.id,
    json: true
  };

  request(data,function(error, response, data){
    var url_found=false;
    var count = 1;
    var posts_count = 0;
    var last_id = null;
    if (!error && response.statusCode === 200) {
      var posts = new Array();
      var iguser = {};
      var igposts = data.user.media.nodes;
      if(typeof igposts != "undefined"){
        for ( var igpost of igposts){
          if(typeof igpost.caption != "undefined"){
            igpost.caption = igpost.caption.replace(/\n/g, " ");
            igpost.caption=emojiStrip(igpost.caption);
            urls = getUrls(igpost.caption,{stripWWW:false});
            var url = "";
            var post_url_found = false;
            for ( var url of urls){
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
    }
    var data = {};
    data.last_id = last_id;
    data.posts = [];
    data.posts_count = posts_count;

    if(url_found){
      data.posts = posts;
    }
    if(last_id !== null){
      res.status(200).jsonp(data);
    }else{
      res.status(404).jsonp({});
    }
  });
});


module.exports = router;
