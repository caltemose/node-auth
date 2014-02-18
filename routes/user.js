module.exports = function(app, db) {
  return {
    getIndex: function(req, res) {
      return res.render('user/index');
    },

    getEdit: function(req, res) {
      
      return res.render('user/edit');
    },

    postEdit: function(req, res) {

    }
  }
}