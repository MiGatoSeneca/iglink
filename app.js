var appconfig = require('./config/app.conf');

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').createServer(app);

var getUrls = require('get-urls');

var scraper = require('./modules/insta-scraper');

server.listen(appconfig.port, function (err) {
  if(!err){
    console.log("Running at: "+appconfig.port);
  }
});

scraper.getAccountInfo('converfit_ap', function(error,data){
  if(!error){
    var url = "";
    for ( var post of data.media.nodes){
      if(post.caption != undefined){
        if (url==""){
          url = getUrls(post.caption);
        }
      }
    }
    var html = "";

    html += "<script>";
    html += " //location.href='"+url+"';";
    html += "</script>";
    console.log(html);
    //res.send(html);
  }

});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  html='<h1>Hello</h1>';
  res.send(html);
});

app.get('/:username',function(req,res){
  scraper.getAccountInfo(req.params.username, function(error,data){
    var html = "";
    if(!error){
      console.log(data);
      var url = "";
      for ( var post of data.media.nodes){
        if(post.caption != undefined){
          if (url==""){
            url = getUrls(post.caption);
          }
        }
      }
      html += "<img src='"+data.profile_pic_url+"'/>";
      html += "<script>";
      html += " location.href='"+url+"';";
      html += "</script>";
      console.log(html);
    }
    res.send(html);
  });
});
