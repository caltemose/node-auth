var 
    //libs
    express = require('express'),
    path = require('path'),
    app = express(),
    passport = require('passport'),
    //config
    db = require('./config/dbm'),
    pass = require('./config/pass'),
    EM = require('./config/email-dispatcher'),
    //routing
    guest = require('./routes/guest')(app, db), // public routes
    user  = require('./routes/user')(app, db), // user only routes
    admin = require('./routes/admin')(app, db); // admin only routes

var CONFIG = {
    port: 3333,
    postlimit: 1024 * 1024 * 10,
    jsonlimit: 1024 * 1024 * 10,
    secret: 'mr-funky-chunky-monkey',
    sessionage: 1*60*60*1000
};

//default HTML <title> value
app.locals.sitetitle = 'Node Auth';

//templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//server settings
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.urlencoded({limit: CONFIG.postlimit}));
app.use(express.json({limit: CONFIG.jsonlimit}));

//session and passport setup 
//@TODO determine best session age values
app.use(express.session({secret: CONFIG.secret, cookie: { maxAge : CONFIG.sessionage }}))
app.use(passport.initialize());
app.use(passport.session());

//static files
app.use(express.static(__dirname + '/public'));

//public routing
app.get('/', pass.getAuthenticated, guest.getIndex);
//login
app.get('/login', guest.getLogin);
app.post('/login', guest.postLogin);
app.get('/logout', guest.logout);
//password reset process
app.get('/lost-password', guest.getLostPassword);
app.post('/lost-password', guest.postLostPassword);
app.get('/reset-password', guest.getResetPassword);
app.post('/reset-password', guest.postResetPassword);
//create new user
app.get('/new-user', guest.getNewUser);
app.post('/new-user', guest.postNewUser);


//user routing
//@TODO add app.all() for /user to ensure authentication
app.get('/user', pass.ensureAuthenticated, user.getIndex);
app.get('/user/edit', pass.ensureAuthenticated, user.getEdit);
app.post('/user/edit', pass.ensureAuthenticated, user.postEdit);

//admin routing
//@TODO add app.all() for /admin to ensure authentication and admin level authorization
app.get('/admin', pass.ensureAuthenticated, pass.ensureAdmin(), admin.getIndex);
app.get('/admin/users', pass.ensureAuthenticated, pass.ensureAdmin(), admin.getUsers);
app.get('/admin/users/delete', pass.ensureAuthenticated, pass.ensureAdmin(), admin.getUserDelete);
app.post('/admin/users/delete', pass.ensureAuthenticated, pass.ensureAdmin(), admin.postUserDelete);


//start server
app.listen(CONFIG.port);
console.log('-------------------------------------------------------------------------------');
console.log('Express server listening on port:     ' + CONFIG.port);
