var passport = require('passport');

module.exports = function(app, db) {
  return {
    getIndex: function(req, res) {
      return res.render('admin/index');
    },

    getUsers: function(req, res) {
      var data = {};
      db.userModel.find(function(err, users) {
        if (err) throw err;
        data.users = users;
        return res.render('admin/users/index', data);
      });
    },

    getUserDelete: function(req, res) {
      res.render('admin/users/delete', {username: req.query.id});
    },

    postUserDelete: function(req, res) {
      var data = {username: req.body.username};
      db.userModel.findOneAndRemove({ username: data.username }, function(err, doc) {
        if (err) data.err = err;
        if (doc) data.doc = doc;
        res.render('admin/users/delete-results', data);
      });
    }
  }
}