var express = require('express');
var router = express.Router();

var http = require('http');
var hurriyet = require('../modules/hurriyet.js');

/* GET home page. */
router.get('/', function(req, res, next) {

console.log('asd');
const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: 'PV5JC3Y42MSMBSTPWHGZ3P4UYQMRM66C'});
client.message(req.query.q, {})
.then((data) => {
  try {
    console.log(JSON.stringify(data));
    var intent = data.entities.intent!=undefined?data.entities.intent[0].value:null;
    var category = data.entities.article_category!=undefined?data.entities.article_category[0].value:null;
    var type = data.entities.type!=undefined?data.entities.type[0].value:null;
    var count = data.entities.article_count!=undefined?data.entities.article_count[0].value:null;

    var speechData = {
       Intent:intent,
       Category:category,
       Type : type,
       Count : count==null?10:count
    }

   if(speechData.Intent=='read'){
        hurriyet.getArticles(speechData.Count,['Description'],speechData.Category,function(result){

            speechData.data = result;
            res.json(speechData);

        });
    }
    else{
        res.json(speechData);
    }
   

} catch (err) {
    console.log('ERR');
    console.log(err);
  res.json(err);
}
   

})

});

module.exports = router;