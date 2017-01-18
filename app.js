const conf = require('./config/app.conf');

var express = require('express');
var bodyParser = require('body-parser');
const pug = require('pug');

var app = express();

var server = require('http').createServer(app);

var getUrls = require('get-urls');

var scraper = require('./modules/insta-scraper');

app.set('views',express.static('views'));
app.set('view engine', 'jade');
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
  var data = conf.pug;
  var html = pug.renderFile('./views/index.pug',data);
  res.send(html);
});

app.get('/:username',function(req,res){
  //Check if username Exists & is in the rigth format
  scraper.getAccountInfo(req.params.username, function(error,data){
    var html = "";
    var url_found=false;
    if(!error){
      var url = "";
      if((typeof data != "undefined") && (typeof data.media != "undefined") && (typeof data.media.nodes != "undefined")){
        for ( var post of data.media.nodes){
          if(post.caption != "undefined"){
            if (url==""){
              url = getUrls(post.caption);
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

app.get('/error',function(req,res){
  var data = conf.pug;
  var html = pug.renderFile('./views/error/index.pug',data);
  res.send(html);
});


/*

app.get('/:username',function(req,res){

  scraper.getAccountInfo(req.params.username, function(error,data){
    var html = "";
    var url_found=false;
    if(!error){
      var url = "";
      if((typeof data != "undefined") && (typeof data.media != "undefined") && (typeof data.media.nodes != "undefined")){
        for ( var post of data.media.nodes){
          if(post.caption != "undefined"){
            if (url==""){
              url = getUrls(post.caption);
            }
          }
        }
      }
      if(url!=""){
        url_found=true;
      }
    }

    html += "<!DOCTYPE html>";
    html += "<html lang='en'>";
    html += "<head>";
    html += "  <meta charset='utf-8'>";
    html += "  <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'>";
    html += "  <meta http-equiv='X-UA-Compatible' content='IE=edge'>";
    html += "  <meta name='description' content='Instagram biolinks always updated'>";
    html += "  <meta name='author' content='igLink'>";
    html += "  <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>";
    html += "  <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans:300,400' type='text/css'>";
    link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400">
    html += "  <link rel='stylesheet' href='./public/assets/css/app.css' type='text/css'>";
    html += "  <title>iglink - Redirection "+req.params.username+"</title>";
    html += "  <script>";

    html += "    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){";
    html += "    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),";
    html += "    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)";
    html += "    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');";
    html += "  ";
    html += "    ga('create', 'UA-90461818-1', 'auto');";
    html += "    ga('send', 'pageview');";
    html += "  ";
    html += "  </script>";
    html += "</head>";
    html += "<body id=''style='background:linear-gradient(rgba(75,180,180,0.8), rgba(255,180,75,0.3));height:100%'>";
    html += "  <div class='container-fluid'/>";
    html += "    <div class='row text-white p-y-150'>";
    html += "  	  <div class='col-md-12 text-center'>";
    html += "  	    <div class='text-center'>";
    html += "  	      <img width='150px' src='./public/assets/img/logo.png'/>";
    html += "  	    </div>";
    html += "  	    <h1>iglink.co</h1>";
    if(!url_found){

      html += "        <h2 class='p-t-20'>:(</h2>";
      html += "        <h4 class='p-t-20'>Sorry, there is no link to redirect you..</h4>";
      html += "        <div class='row p-t-20'>";
      html += "          <div class='col-md-4 col-md-offset-4'>";
      html += "            <div>";
      html += "              <a href='http://instagram.com/"+req.params.username+"' class='btn btn-primary btn-block'>Back to Instagram Profile</a>";
      html += "            </div>";
      html += "          </div>";
      html += "        </div>";
      html += "        <script>";
      html += "          ga('send', 'event', 'redirection', 'redirection_error', '"+req.params.username+"');";
      html += "        </script>";
    }else{



      html += "        <h4 class='p-t-20'>Creating redirection..</h4>";
      html += "        <div class='spinner'>";
      html += "          <svg width='40px' height='40px' viewBox='0 0 66 66' xmlns='http://www.w3.org/2000/svg'>";
      html += "            <circle fill='none' stroke-width='4' stroke-linecap='round' cx='33' cy='33' r='30' class='circle'></circle>";
      html += "          </svg>";
      html += "        </div>";
      html += "        <script>";
      html += "          ga('send', 'event', 'redirection', 'redirection_success', '"+req.params.username+"');";
      html += "        </script>";
    }
    html += "        <h5>iglink.co helps Instagram users to have the biography link</h5>";
    html += "        <h5>always updated with the link of their last post</h5>";
    html += "      </div>";
    html += "    </div>";
    html += "  </div>";
    html += "  <footer class='p-t-20 text-white'>";
    html += "    <p class='text-center p-t-20'>created with lots of <span class='emoji'>❤️</span> by the <b>iglink team</b> © 2017</p>";
    html += "  </footer>";
    if(url_found){
      html += "  <script>";
      html += "   location.href='"+url+"';";
      html += "  </script>";
    }
    html += "</body>";

    html += "</html>";
    html += "";

    res.send(html);
  });
});

*/
