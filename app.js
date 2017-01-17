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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use('/public', express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',function(req,res){
	var html = "";
	html += "<!DOCTYPE html>";
	html += "<html lang='en'>";
	html += "<head>";
	html += "  <meta charset='utf-8'>";
	html += "  <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'>";
	html += "  <meta http-equiv='X-UA-Compatible' content='IE=edge'>";
	html += "  <meta name='author' content='igLink'>";
	html += "  <title>iglink - your Instagram link always updated</title>";
	html += "  <meta name='description' content='With Iglink your profile link at Instagram will be always updated linking the right place'>";
	html += "  <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>";
  html += "  <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans:300,400' type='text/css'>";
  html += "  <link rel='stylesheet' href='/public/css/app.css' type='text/css'>";
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
	html += "<body>";
	html += "  <div class='container-fluid' id='main-container'/>";
	html += "    <div class='row text-white p-y-150'>";
	html += "      <div class='col-md-12 text-center'>";
	html += "        <div class='text-center'>";
	html += "          <img width='150px' src='/public/img/logo.png'/>";
	html += "        </div>";
	html += "        <h1>iglink.co</h1>";
	html += "        <h2>Stop updating your Instagram link</h2>";
	html += "        <h4>using iglink.co your biography link will be always updated</h4>";
	html += "        <h4>with the link of your last post</h4>";
	html += "        <div class='row p-t-20'>";
	html += "          <div class='col-md-12 text-center height-150'>";
	html += "            <form id='create-form'>";
	html += "              <div class='row'>";
	html += "                <div class='col-md-4 col-md-offset-4'>";
	html += "                  <div class='form-group form-group-iglink'>";
	html += "                    <input type='username' class='form-control' id='username' placeholder='Enter your instagram acount'>";
	html += "                  </div>";
	html += "                  <input type='submit' class='btn btn-primary btn-block' value='Create your link'/>";
	html += "                </div>";
  html += "              </div>";
	html += "            </form>";
	html += "            <div id='result-form' class='hidden'>";
	html += "              <p id='result-iglink'>http://iglink.co/<span id='username'></span></p>";
	html += "              <div class='row'>";
	html += "                <div class='col-md-4 col-md-offset-4'>";
	html += "                  <a id='result-copy-button' data-clipboard-text='' href='javascript:void(0);' class='btn btn-success btn-block'>Copy your link</a>";
  html += "                  <div class='p-t-20'>";
  html += "                     <a id='reset-form' href='javascript:void(0)' class='text-white'/>Create another link</a>";
  html += "                  </div>";
	html += "                </div>";
	html += "              </div>";
	html += "            </div>";
	html += "          </div>";
	html += "        </div>";
	html += "      </div>";
	html += "    </div>";
	html += "  </div>";
	html += "  <footer>";
	html += "    <p class='text-center p-t-20'>created with lots of <span class='emoji'>❤️</span> by the <b>iglin team</b> © 2017</p>";
	html += "  </footer>";
	html += "  <script src='https://code.jquery.com/jquery-3.1.1.min.js' integrity='sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=' crossorigin='anonymous'></script>";
	html += "  <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js' integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa' crossorigin='anonymous'></script>";
  html += "  <script src='https://cdn.jsdelivr.net/clipboard.js/1.5.16/clipboard.min.js'></script>";
  html += "  <script src='/public/js/app.js'></script>";
	html += "</body>";
	html += "</html>";
	res.send(html);
});

app.get('/:username',function(req,res){

  scraper.getAccountInfo(req.params.username, function(error,data){
    var html = "";
    var url_found=false;
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
    html += "  <link rel='stylesheet' href='./public/css/app.css' type='text/css'>";
    html += "  <title>igLink Redirection...</title>";
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
    html += "<body id=''style='background-color:#f4f4f4;height:100%'>";
    html += "  <div class='container-fluid'/>";
    html += "    <div class='row text-grey p-y-150'>";
    html += "  	  <div class='col-md-12 text-center'>";
    html += "  	    <div class='text-center'>";
    html += "  	      <img width='150px' src='./public/img/logo_grey.png'/>";
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
    html += "  <footer class='p-t-20'>";
    html += "    <p class='text-center p-t-20'>created with lots of <span class='emoji'>❤️</span> by the <b>iglin team</b> © 2017</p>";
    html += "  </footer>";
    if(!url_found){
      html += "  <script>";
      //html += "   location.href=''+url+'';";
      html += "  </script>";
    }
    html += "</body>";
    html += "</html>";
    html += "";

    res.send(html);
  });
});
