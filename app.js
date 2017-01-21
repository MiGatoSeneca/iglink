const conf = require('./config/app.js');

var express = require('express');
var bodyParser = require('body-parser');
const pug = require('pug');

var app = express();

var server = require('http').createServer(app);

var getUrls = require('get-urls');

//var scraper = require('./modules/insta-scraper');

var request = require("request")


app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

server.listen(conf.port, function (err) {
  if(!err){
    console.log("Running at: "+conf.port);
  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});


app.get('/api/version',function(req,res){
  var response={
    "version":conf.version
  };
  res.status(200).jsonp(response);
});

app.get('/', function(req, res, next) {

  const lang = require('./lang/es_ES.js');

  var data = conf.pug;
  data.lang = lang;
  var html = pug.renderFile('./views/index.pug',data);
  res.send(html);
});

app.get('/:username',function(req,res){
  //Check if username Exists & is in the rigth format

  var data = {
    url: "https://www.instagram.com/"+req.params.username+"/?__a=1",
    json: true
  };
  request(data,function(error, response, data){
    var url_found=false;
    if (!error && response.statusCode === 200) {
      var url = "";
      var igposts = data.user.media.nodes;
      if(typeof igposts != "undefined"){
        for ( var igpost of igposts){
          if(typeof igpost.caption != "undefined"){
            igpost.caption = igpost.caption.replace(/\n/g, " ");
            if (url==""){
              url = getUrls(igpost.caption);
              if(url!=""){
                break;
              }
            }
          }
        }
      }
      if(url!=""){
        url_found=true;
      }
    }
    var data = conf.pug;
    data.username = req.params.username;
    if(url_found){
      data.url = url;
      var html = pug.renderFile('./views/redirection/index.pug',data);
      res.send(html);
    }else{
      var html = pug.renderFile('./views/redirection/error/index.pug',data);
      res.send(html);
    }
  });
});
