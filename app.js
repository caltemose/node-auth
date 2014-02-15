var 
    //libs
    express = require('express'),
    path = require('path'),
    app = express(),
    passport = require('passport'),
    //config
    db = require('./config/dbschema'),
    pass = require('./config/pass'),
    EM = require('./config/email-dispatcher'),
    //routing
    content = require('./routes/content')(app, db),
    admin = require('./routes/admin')(app, db);


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
//@TODO research best session age values
app.use(express.session({secret:'mr-funky-chunky-monkey', cookie: { maxAge : 1*60*60*1000 }}))
app.use(passport.initialize());
app.use(passport.session());

// 3600000 = 3600 * 1000 = 60 * 60 * 1000

//static files
app.use(express.static(__dirname + '/public'))

//public routing
app.get('/', pass.getAuthenticated, content.displayIndex);
//login
app.get('/login', content.displayLogin); // @TODO change this name -> getLogin()
app.post('/login', content.postLogin);
app.get('/logout', content.logout);
//password reset process
app.get('/lost-password', content.getLostPassword);
app.post('/lost-password', content.postLostPassword);
app.get('/reset-password', content.getResetPassword);
app.post('/reset-password', content.postResetPassword);
//create new user
app.get('/new-user', content.getNewUser);
app.post('/new-user', content.postNewUser);


//user routing
app.get('/account', pass.ensureAuthenticated, content.displayAccount);


//admin routing
app.get('/admin', pass.ensureAuthenticated, pass.ensureAdmin(), admin.getIndex);
app.get('/admin/users', pass.ensureAuthenticated, pass.ensureAdmin(), admin.getUsers);
app.get('/admin/users/delete', pass.ensureAuthenticated, pass.ensureAdmin(), admin.getUserDelete);
app.post('/admin/users/delete', pass.ensureAuthenticated, pass.ensureAdmin(), admin.postUserDelete);

//start server
var port = 3333;
app.listen(port);
console.log('-------------------------------------------------------------------------------');
console.log('Express server listening on port:     ' + port);
