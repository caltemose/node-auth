var passport = require('passport');
var defaultData = {auth:true,admin:true};

module.exports = function(db) {
  return {
    displayIndex: function(req, res) {
      return res.render('admin/index', defaultData);
    }
  }
}