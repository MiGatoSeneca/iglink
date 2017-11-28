console.log("redirection");

$(document).ready(function(){
  getPosts(last_id);
});
var scroll_handeler = false;

function getPosts(max_id){
  
  if(!onRedirection){
    console.log("call getPosts");
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: document.location.origin+"/api/"+username+"/"+max_id,
      error: function(data, textStatus, jqXHR) {
      },
      success: function(data) {
        for ( var post of data.posts){
          posts_count++;
          var html = "";
          html += "<div class='col-md-4 col-xs-4 text-center p-15 p-xs-5 fade-in'>";
          html += " <a href='"+post.url+"'>";
          html += "   <img src='"+post.thumbnail_src+"' class='width-100per' alt='Link #"+post.count+" "+data.username+"'>";
          html += " </a>";
          html += "</div>";
          $("#posts").append(html);
        }
        getPosts(data.last_id);
      }
  
    });  
  }
  
}
