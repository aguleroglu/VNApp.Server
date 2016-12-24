var express = require('express');
var router = express.Router();

var hurriyet = require('../modules/hurriyet.js');

/* GET home page. */
router.get('/', function(req, res, next) {
hurriyet.getArticles(50,"Id,Title,Path","",function(res){
 
 console.log(res); 
});
 

  // hurriyet.getSingleArticle("40199111","",function(result){
 
  //           console.log(result); 

  //       });
 
  res.render('index', { title: 'Express' });
});

module.exports = router;
