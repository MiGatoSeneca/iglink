var conf = require('../../config/app.js');
var express = require('express');
var router = express.Router();
var request = require("request")
var getEmails = require('get-emails');
var whoisParser = require('parse-whois');
var whois = require('whois');
var emojiStrip = require('emoji-strip');
var cron = require('cron').CronJob;

var query = "";


//DB Connection
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

console.log("[bottags] Hi! I'm Bottags your bot to search by tags");
var tags =["receta","recetas","cocina","comida","comidasana","comidareal","comidasaludable","comersano","sanoyrico"];
console.log("[bottags] My tags for today are: "+tags);

/*
new cron('0 0 * * * *', function() {
  searchByTags(tags);
},null, true, 'Europe/Madrid');

new cron('0,10,20,30,40,50 0 * * * *', function() {
  updateDB();
},null, true, 'Europe/Madrid');
*/

function updateDB(){
  if(query != ""){
    console.log("[bottags] Let's save this stuff...");
    var processQuery = query;
    query = "";
    var connection = new Connection(conf.sql);
    connection.on('connect', function(err) {
      var rows = [];
      connection.execSql(new Request(processQuery, function(err, rowsCount){
        if(err){
          console.log(err);
          connection.close();
        }else{
          console.log("[bottags] Stuff saved!");
          connection.close();
        }
      }));
    });
  }
}

function searchByTags (tags){

  console.log("[bottags] There is some task to do!");
  for (var tag of tags){
    updateDB();
    console.log("[bottags] Checking #"+tag);
    var data = {
      url: "https://www.instagram.com/explore/tags/"+tag+"/?__a=1",
      json: true
    };
    request(data,function(error, response, data){
      if (!error && response.statusCode === 200) {
        var posts = new Array();
        var igposts = data.tag.media.nodes;
        igposts = igposts.concat(data.tag.top_posts.nodes)
        if(typeof igposts != "undefined"){
          for ( var igpost of igposts){
            var data = {
              url: "https://www.instagram.com/p/"+igpost.code+"/?__a=1",
              json: true
            };
            request(data,function(error, response, data){
              if (!error && response.statusCode === 200) {
                var data = {
                  url: "https://www.instagram.com/"+data.media.owner.username+"/?__a=1",
                  json: true
                };
                request(data,function(error, response, data){
                  if (!error && response.statusCode === 200) {
                    data.user.email = '';
                    if(data.user.external_url === null){
                      data.user.external_url = '';
                    }
                    if(data.user.full_name === null){
                      data.user.full_name = '';
                    }else{
                      data.user.full_name = emojiStrip(data.user.full_name);
                    }
                    var has_email = false;
                    if(data.user.biography !== null){
                      data.user.biography=emojiStrip(data.user.biography);
                      emails=getEmails(data.user.biography);
                      var coma="";
                      for (var email of emails){
                        has_email = true;
                        data.user.email = coma+email;
                        coma=",";

                      }
                    }
                    data.user.likesAverage=0;

                    //Calcular likesAverage
                    var user = {
                      username : data.user.username,
                      fullName : data.user.full_name,
                      follows : data.user.follows.count,
                      followed : data.user.followed_by.count,
                      likesAverage : data.user.likesAverage,
                      nodesCount : data.user.media.count,
                      urlAverage : data.user.urlAverage,
                      email : data.user.email,
                      url : data.user.external_url
                    }
                    var insertColumns="";
                    var insertValues="";
                    var updateSentence="";
                    var coma="";
                    for (var key in user){
                      if(user[key] !== undefined){
                        insertColumns+=coma+key;
                        if(typeof user[key] == 'string'){
                          insertValues+=coma+"'"+user[key].replace(/'/g, "''")+"'";
                          updateSentence+=coma+key+"='"+user[key].replace(/'/g, "''")+"'";
                        }else{
                          insertValues+=coma+user[key];
                          updateSentence+=coma+key+"='"+user[key]+"'";
                        }
                        coma=",";
                      }
                    }
                    query += "IF EXISTS (SELECT BUID FROM bottags_users WHERE username = '"+user.username+"') ";
                    query += "BEGIN ";
                    query += "  UPDATE bottags_users SET "+updateSentence+" WHERE username = '"+user.username+"' ";
                    query += "END ";
                    query += "ELSE ";
                    query += "BEGIN ";
                    query += "  INSERT INTO bottags_users ("+insertColumns+") VALUES ("+insertValues+") ";
                    query += "END ";
                    query += "";

                  }
                });
              }
            });
          }
        }
      }
    });
  }

};
