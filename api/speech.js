var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var Article = require('../models/Article.js'); 
/* GET home page. */
router.get('/', function(req, res, next) {

const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: 'PV5JC3Y42MSMBSTPWHGZ3P4UYQMRM66C'});
client.message(req.query.q, {})
.then((data) => {
    console.log(JSON.stringify(data));

    var request_type = 'first-interaction';

    if(req.query.type!=undefined){
        request_type = req.query.type;
    }

    var intent = data.entities.intent!=undefined?data.entities.intent[0].value:null;

    var category = null;

    if(intent=='search'){
        category = data.entities.location!=undefined?data.entities.location[0].value:null;
    }
    if(data.entities.article_category!=undefined){
        category = data.entities.article_category!=undefined?data.entities.article_category[0].value:null;
    }

    var type = data.entities.type!=undefined?data.entities.type[0].value:null;
    var count = data.entities.article_count!=undefined?data.entities.article_count[0].value:null;



    var speechData = {
       Intent:intent,
       Category:category,
       Type : type,
       Count : count==null?3:count,
       Data:null
    }
    
    if(request_type=='first-interaction'){
        if(speechData.Intent=='read'){
        if(speechData.Category!=null){
            Article.find({Category:speechData.Category}).limit(speechData.Count).then(function(dic){
                console.log(dic);
                speechData.Data = dic;
                res.json(speechData);

            });
        }else{ 
            Article.find({}).limit(speechData.Count).exec(function(err,dic){
                console.log('else '+dic);
                speechData.Data = dic;
                res.json(speechData); 
            });
        }
    }
    else if(speechData.Intent == 'search'){
        Article.find({ $text : { $search : speechData.Category } }).limit(speechData.Count).exec(function(err,dic){
                console.log(dic);
                if(dic==null || dic.length==0){
                    speechData.error = 'Böyle bir sonuç bulamadım.';
                }
                speechData.Data = dic;
                res.json(speechData);

            });
    }
    }
    else if(request_type=='after-read-interaction'){
        res.json(speechData);
    }
    else if(request_type=='endof-read-interaction'){
        var skip = req.query.skip;
        if(speechData.Intent=='read' || speechData.Intent=='continue' || speechData.Intent=='yes'){
            //Skip ve limite göre data dönmem lazım. Kategori
            if(speechData.Category!=null){
            Article.find({Category:speechData.Category}).skip(parseInt(skip)).limit(speechData.Count).exec(function(err,dic){
                console.log(dic);
                speechData.Data = dic;
                res.json(speechData);

            });
        }else{ 
            Article.find({}).skip(parseInt(skip)).limit(speechData.Count).exec(function(err,dic){
                console.log('else '+dic);
                speechData.Data = dic;
                res.json(speechData); 
            });
        }
        }
        else if(speechData.Intent=='no' || speechData.Intent=='stop'){
            res.json(speechData);
        }
        else{
            res.json(speechData);
        }
    }
    else{

        res.json(speechData);
    }

});

});

module.exports = router;