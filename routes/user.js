module.exports = function(app, db) {
  return {
    getIndex: function(req, res) {
      return res.render('user/index');
    },

    getEdit: function(req, res) {
      return res.render('user/edit');
    },

    postEdit: function(req, res) {
      var user = req.user;
      user.email = req.body.email;
      user.save(function(err, user) {
        var data = {};
        if(err) data.err = err;
        if (user) {
          data.user = user;
          data.userUpdated = true;
        }
        return res.render('user/edit', data);
      });
    }
  }
}