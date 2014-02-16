var passport = require('passport');
var defaultData = {auth:true,admin:true};

module.exports = function(app, db) {
  return {
    getIndex: function(req, res) {
      return res.render('admin/index', defaultData);
    },

    getUsers: function(req, res) {
      var data = {auth:true,admin:true};
      db.userModel.find(function(err, users) {
        if (err) throw err;
        data.users = users;
        return res.render('admin/users', data);
      });
    },

    getUserDelete: function(req, res) {
      var data = {auth:true,admin:true};
      data.user = req.query.id;
      res.render('admin/users-delete', data);
    },

    postUserDelete: function(req, res) {
      var data = {auth:true,admin:true};
      data.user = req.body.user;
      //@TODO delete this user from the system and display results
      res.render('admin/users-delete-results', data);
    }
  }
}