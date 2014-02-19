var passport = require('passport'),
    bcrypt = require('bcrypt'),
    schema = require('../config/dbschema'),
    EM = require('../config/email-dispatcher');

module.exports = function(app, db) {
  return {
    getIndex: function(req, res) {
      if (req.isAuthenticated()) {
        if (req.user && req.user.admin) {
          db.userModel.find(function(err, users) {
            if (err) throw err;
            return res.render('public/home', {users:users});
          });
        } else return res.render('public/home');
      } else {
        return res.render('public/home');
      }
    },

    getLogin: function(req, res) {
      return res.render('public/login', {});
    },

    postLogin: function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
          var data = {flash: info.message};
          return res.render('public/login', data);
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      })(req, res, next);
    },

    logout: function(req, res) {
      req.logout();
      res.redirect('/');
    },

    getLostPassword: function(req, res) {
      return res.render('public/password/lost-password', {});
    },

    postLostPassword: function(req, res) {
      db.userModel.findOne({email:req.body.email}, function(err, user) {
        if (err) throw err;
        if (user && user.email) {
          EM.dispatchResetPasswordLink(user, function(err, m) {
            var data = {user: user};
            if (!err) data.success = true;
            console.log('email sent? ' + data.success);
            return res.render('public/password/lost-password-results', data);
          });
        } else {
          var data = {nouser: req.body.email};
          return res.render('public/password/lost-password', data);
        }
      });
    },

    getResetPassword: function(req, res) {
      var email = req.query["e"],
          passH = req.query["p"];
      if (!email || !passH) res.redirect('/')
      else {
        db.userModel.find({ $and: [{email:email, password:passH}] }, function(err, user) {
          if (user) {
            req.session.reset = { email:email, passHash:passH };
            res.render('public/password/reset-password', {email:email});
          } else res.redirect('/');
        });
      }   
    },

    postResetPassword: function(req, res) {
      var data = {};
      var newPass = req.param('password');
      var email = req.session.reset.email;
      req.session.destroy();
      data.email = email;
      db.userModel.findOne({email:email}, function(err, user) {
        if (err) data.err = err;
        else {
          user.password = newPass;
          user.save(function(err) {
            if (err) data.err = err;
            res.render('public/password/reset-password-results', data);
          });
        }
      });
    },

    getNewUser: function(req, res) {
      res.render('public/create-user/index');
    },

    postNewUser: function(req, res) {
      var newUser = schema.userModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        admin: false
      });
      newUser.save(function(err, user) {
        var data = {};
        if (err) {
          data.err = err; 
          return res.render('public/create-user', data);
        }
        if (user) {
          data.user = user;
          data.pagetitle = "New User Created Successfully"
        } else data.pagetitle = "Could Not Create New User"
        res.render('public/create-user/results', data);
      });
    }
  }
}