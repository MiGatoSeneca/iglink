var appconfig = require('./config/app.conf');

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').createServer(app);

var getUrls = require('get-urls');

var scraper = require('./modules/insta-scraper');

var ua = require('universal-analytics');
var vua = ua('UA-90461818-1');

server.listen(appconfig.port, function (err) {
  if(!err){
    console.log("Running at: "+appconfig.port);
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
  vua.pageview("/"+req.params.username).send();
  vua.event("Server", "Redirection",req.params.username).send()

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
      html += "<!DOCTYPE html>";
      html += "<html lang='en'>";
      html += "<head>";
      html += "  <meta charset='utf-8'>";
      html += "  <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'>";
      html += "  <meta http-equiv='X-UA-Compatible' content='IE=edge'>";
      html += "  <meta name='description' content='Instagram biolinks always updated'>";
      html += "  <meta name='author' content='instaLink'>";
      html += "  <title>InstaLink Redirection...</title>";
      html += "</head>";
      html += "<body>";
      html += " <div style='text-align:center;padding-top:50px'>";
      html += "   <img src='"+appconfig.logo+"' style='max-width:80%'/>";
      html += " </div>";
      html += "<script>";
      html += " location.href='"+url+"';";
      html += "</script>";
      html += "</body>";
      html += "</html>";
      console.log(html);
    }
    res.send(html);
  });
});
