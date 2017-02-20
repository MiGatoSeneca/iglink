function reload(username){
  ga('send', 'event', 'configuration', 'redirection_reload', username);
  window.location.href = window.location.href + "?reload=true";
}
