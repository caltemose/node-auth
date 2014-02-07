var passport = require('passport');

module.exports = function(db) {
  return {
    displayIndex: function(req, res) {
      db.userModel.find(function(err, users) {
        if (err) throw err;
        return res.render('home', {users: users});
      })
    },

    displayLogin: function(req, res) {
      return res.render('login');
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

    displayUser: function(req, res) {
      console.log(req.user);
      return res.render('user', {user: req.user});
    }
  }
}


// exports.displayIndex = function(req, res) {
//   var users = db.collection('users');
//   users.find({}).toArray(function(err, results) {
//     if(err) throw err;
//     return res.render('home', {users: results});
//   });
// }


// function ContentHandler (db) {

//   var passport = require('passport');

//   this.displayIndex = function(req, res, next) {
//     var users = db.collection('users');
//     users.find({}).toArray(function(err, results) {
//       if(err) throw err;
//       return res.render('home', {users: results});
//     });
//   }

//   this.displayLogin = function(req, res, next) {
//     return res.render('login');
//   }

//   this.postLogin = function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//       if (err) { return next(err) }
//       if (!user) {
//         req.session.messages =  [info.message];
//         return res.redirect('/login')
//       }
//       req.logIn(user, function(err) {
//         if (err) { return next(err); }
//         return res.redirect('/');
//       });
//     })(req, res, next);
//   }

// }

// module.exports = ContentHandler;