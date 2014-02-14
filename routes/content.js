var passport = require('passport'),
    bcrypt = require('bcrypt'),
    EM = require('../config/email-dispatcher');

module.exports = function(db) {
  return {
    displayIndex: function(req, res) {
      if (req.isAuthenticated()) {
        var data = {auth:true};
        if (req.user && req.user.admin) data.admin = true;
        if (data.admin) {
          db.userModel.find(function(err, users) {
            if (err) throw err;
            data.users = users;
            return res.render('home', data);
          });
        } else return res.render('home', data);
      } else {
        return res.render('home', {auth:false});
      }
    },

    displayLogin: function(req, res) {
      var data = {};
      console.log(req.session.messages);
      if (req.session.messages) data.flash = req.session.messages;
      return res.render('account/login', data);
    },

    postLogin: function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
          req.session.messages =  [info.message];
          return res.redirect('/login')
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
      var data = {auth:true};
      data.user = req.user;
      if (req.user.admin) data.admin = true;
      return res.render('account/index', data);
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
    }
  }
}