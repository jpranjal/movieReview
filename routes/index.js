
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('movie-list', { title: 'Express' });
};