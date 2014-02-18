$(function(){
  //catch submit button click
  $('input[type="submit"]').click(function(e){
    var username = $('input[name="username"]').val(),
        password = $('input[name="password"]').val();

    if (username.length < 1 || password.length < 1) {
      e.preventDefault();
      //show errors  
    }
  });
})