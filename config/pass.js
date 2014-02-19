var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('./dbm');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.userModel.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  db.userModel.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

//simple route middleware to determine if user is authenticated
exports.getAuthenticated = function getAuthenticated(req, res, next) {
  if (req.user) {
    res.locals.user = {
      username: req.user.username,
      email: req.user.email,
      admin: req.user.admin
    };
    if (req.isAuthenticated()) res.locals.auth = true;
  }
  return next();
}

//simple route middleware to ensure user is authenticated
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.auth = true;
    if (req.user) {
      res.locals.user = {
        username: req.user.username,
        email: req.user.email,
        admin: req.user.admin
      };  
    }
    return next();
  }
  res.redirect('/login');
}

//check for admin middleware, this is unrelated to passport.js
exports.ensureAdmin = function ensureAdmin(req, res, next) {
  return function(req, res, next) {
    if(req.user && req.user.admin === true) next();
    else res.send(403);
  }
}
