var express = require('express'),
    path = require('path'),
    app = express(),
    db = require('./config/dbschema'),
    pass = require('./config/pass'),
    passport = require('passport'),
    content = require('./routes/content')(db);

// MongoClient.connect('mongodb://localhost:27017/passportlocal', function(err, db) {
//   "use strict";
//   if(err) throw err;

  //templating engine
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  //server settings
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.urlencoded({limit: 1024 * 1024 * 10}));
  app.use(express.json({limit: 1024 * 1024 * 10}));

  //session and passport setup 
  app.use(express.session({secret:'mr-funky-chunky-monkey'}))
  app.use(passport.initialize());
  app.use(passport.session());

  //static files
  //app.use(express.static(__dirname + '/public'))

  //application routes
  //routes(app, db);
  app.get('/', content.displayIndex);

  app.get('/login', content.displayLogin);
  app.post('/login', content.postLogin);
  app.get('/logout', content.logout);

  app.get('/user', pass.ensureAuthenticated, content.displayUser);


  //start server
  var port = 3333;
  app.listen(port);
  console.log('Express server listening on port ' + port);


// });


console.log('--------------------------------------------->  app.js');