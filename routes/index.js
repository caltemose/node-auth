var ContentHandler = require('./content');
    passport = require('passport');
    //pass = require('../config/pass');


module.exports = exports = function(app, db) {
  
  var pass = require('../config/pass')(app, db),
      contentHandler = new ContentHandler(db);

  app.get('/', contentHandler.displayIndex);

  app.get('/login', contentHandler.displayLogin);
  app.post('/login', contentHandler.postLogin);


}