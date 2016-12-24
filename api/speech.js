var express = require('express');
var router = express.Router();

var http = require('http');
var hurriyet = require('../modules/hurriyet.js');

/* GET home page. */
router.get('/', function(req, res, next) {
 console.log(req.query.q  + " " + req.query.id + " " + req.query.type);
const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: 'PV5JC3Y42MSMBSTPWHGZ3P4UYQMRM66C'});
client.message(req.query.q, {}) 
.then((data) => {
  try {
      console.log("Path = " + req.query.q  + " " + req.query.id + " " + req.query.type);
    console.log(JSON.stringify(data));
    var intent = data.entities.intent!=undefined?data.entities.intent[0].value:null;
    var category = data.entities.article_category!=undefined?data.entities.article_category[0].value:null;
    var type = data.entities.type!=undefined?data.entities.type[0].value:null;
    var count = data.entities.article_count!=undefined?data.entities.article_count[0].value:null;

    var speechData = {
       Intent:intent,
       Category:category,
       Type : type,
       Count : count==null?3:count
    }
    var types = ['first-click','after-article','finish-article'];
    for(var i = 0; i< types.length; i++){
        if(req.query.type == types[i]){
            
            if(speechData.Intent=='read')
            {
                hurriyet.getArticles(speechData.Count,['Description'],speechData.Category,function(result){ 
                    speechData.data = result;
                    res.json(speechData); 
                });
            }
            else if(speechData.Intent=='continue') 
            {
                 hurriyet.getSingleArticle(req.query.id,['Text'],speechData.Category,function(result){ 
                    speechData.data = result;
                    res.json(speechData); 
                });
            }
            else
            {
                res.json(speechData);
            }
        }
    }

//     if(req.query.type =="first-click")
//     {
//         getArticlesA();
//         if(speechData.Intent=='read')
//         {
//             hurriyet.getArticles(speechData.Count,['Description'],speechData.Category,function(result){ 
//                 speechData.data = result;
//                 res.json(speechData); 
//             });
//         }
//         else { res.json(speechData); }
//     }
//     else if(req.query.type == "after-article"){

//     }
//     else if(req.query.type=="finish-article"){

//     }
//    if(speechData.Intent=='read'){
//         hurriyet.getArticles(speechData.Count,['Description'],speechData.Category,function(result){ 
//             speechData.data = result;
//             res.json(speechData); 
//         });
//     }
//     else{
//         res.json(speechData);
//     }

   

} catch (err) {
    console.log('ERR');
    console.log(err);
  res.json(err);
}
   

})

});
function getArticlesA(res){ 
}
module.exports = router;