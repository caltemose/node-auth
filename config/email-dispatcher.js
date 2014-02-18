var ES = require('./email-settings');
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({

  host      : ES.host,
  user      : ES.user,
  password  : ES.password,
  ssl       : true

});

EM.dispatchResetPasswordLink = function(account, callback)
{
  EM.server.send({
    from         : ES.sender,
    to           : 'chad@chadzilla.com', //account.email,
    subject      : 'Node Auth - Password Reset',
    //@TODO integrate proper text-only email message
    text         : 'something went wrong... :(', 
    attachment   : EM.composeEmail(account)
  }, callback );
}

EM.composeEmail = function(user)
{
  //@TODO variableize the hostname in the reset email link
  var link = 'http://localhost:3333/reset-password?e=' + user.email + '&p=' + user.password;
  var html = "<html><body>";
    html += "Hi, " + user.username + "<br><br>";
    html += "You recently clicked the <b>forgot password?</b> link on the Node Auth site.<br>";
    html += "If this was not you, ignore this email.<br><br>";
    html += "To reset your password, please open this link in your browser:<br>";
    html += "<a href='" + link + "'>Click here to reset your password</a><br><br>";
    html += "You can then change your password.<br><br>";
    html += "Thanks,<br>Node Auth Mgmt";
    html += "</body></html>";
  return  [{data:html, alternative:true}];
}