var express = require('express');
var router = express.Router();

var hurriyet = require('../modules/hurriyet.js');

/* GET home page. */
router.get('/', function(req, res, next) {
hurriyet.getArticles(5,function(res){

  console.log(res);

});

  res.render('index', { title: 'Express' });
});

module.exports = router;
