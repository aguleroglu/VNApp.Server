var express = require('express');
var router = express.Router();

var hurriyet = require('../modules/hurriyet.js');

/* GET home page. */
router.get('/', function(req, res, next) {
// hurriyet.getArticles(5,"Id,Title,Path","",function(res){

//  var data = JSON.parse(res);
//  data.forEach(function(element) {
//    hurriyet.getSingleArticle("/"+element.Id,"Description",function(res){
//   console.log(res);
// });
//  }, this);


// });

  res.render('index', { title: 'Express' });
});

module.exports = router;
