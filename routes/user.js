module.exports = function(app, db) {
  return {
    getIndex: function(req, res) {
      return res.render('user/index');
    }
  }
}