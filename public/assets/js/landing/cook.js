$('form').submit(function(e){
  e.preventDefault();
});
$('#create-form').submit(function(){
  var username = $('#create-form #username').val();
  if(username != ""){
    $('#create-form').addClass('hidden');
    ga('send', 'event', 'creation', 'creation_cook', username);
    fbq('track', 'CompleteRegistration');
    $('#result-form #username').html(username);
    $('#result-copy-button').attr('data-clipboard-text','http://iglink.co/'+username);
    new Clipboard('#result-copy-button');
    $('#result-form').removeClass('hidden');
  }else{
    ga('send', 'event', 'creation_error', 'creation_cook_error', 'not_username');
  }
});
$('#reset-form').click(function(){
  $('#result-form').addClass('hidden');
  $('#create-form #username').val('');
  $('#create-form').removeClass('hidden');
});
