var passport = require('passport'),
    bcrypt = require('bcrypt'),
    schema = require('../config/dbschema'),
    EM = require('../config/email-dispatcher');

module.exports = function(app, db) {
  return {
    displayIndex: function(req, res) {
      if (req.isAuthenticated()) {
        if (req.user && req.user.admin) {
          db.userModel.find(function(err, users) {
            if (err) throw err;
            return res.render('home', {users:users});
          });
        } else return res.render('home');
      } else {
        return res.render('home');
      }
    },

    displayLogin: function(req, res) {
      return res.render('account/login', {});
    },

    postLogin: function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
          var data = {flash: info.message};
          return res.render('account/login', data);
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

    displayAccount: function(req, res) {
      return res.render('account/index');
    },

    getLostPassword: function(req, res) {
      return res.render('account/lost-password', {});
    },

    postLostPassword: function(req, res) {
      db.userModel.findOne({email:req.body.email}, function(err, user) {
        if (err) throw err;
        if (user && user.email) {
          EM.dispatchResetPasswordLink(user, function(err, m) {
            var data = {user: user};
            if (!err) data.success = true;
            console.log('email sent? ' + data.success);
            return res.render('account/lost-password-results', data);
          });
        } else {
          var data = {nouser: req.body.email};
          return res.render('account/lost-password', data);
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
            res.render('account/reset-password', {email:email});
          } else res.redirect('/');
        });
      }   
    },

    postResetPassword: function(req, res) {
      var newPass = req.param('password');
      var email = req.session.reset.email;
      req.session.destroy();
      var data = {};
      data.email = email;
      db.userModel.findOne({email:email}, function(err, user) {
        if (err) data.err = err;
        else {
          user.password = newPass;
          user.save(function(err) {
            if (err) data.err = err;
            else data.success = true;
            res.render('account/reset-password-results', data);
          });
        }
      });
    },

    getNewUser: function(req, res) {
      res.render('account/create-user');
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
          return res.render('account/create-user', data);
        }
        if (user) {
          data.user = user;
          data.pagetitle = "New User Created Successfully"
        } else data.pagetitle = "Could Not Create New User"
        res.render('account/create-user-results', data);
      });
    }
  }
}