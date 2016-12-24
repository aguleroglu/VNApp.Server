var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var Article = require('../models/Article.js'); 
/* GET home page. */
router.get('/', function(req, res, next) {

 Article.find().exec(function(err,dic){
                console.log('else '+dic);
            });

const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: 'PV5JC3Y42MSMBSTPWHGZ3P4UYQMRM66C'});
client.message(req.query.q, {})
.then((data) => {
    console.log(JSON.stringify(data));
    var intent = data.entities.intent!=undefined?data.entities.intent[0].value:null;
    var category = data.entities.article_category!=undefined?data.entities.article_category[0].value:null;
    var type = data.entities.type!=undefined?data.entities.type[0].value:null;
    var count = data.entities.article_count!=undefined?data.entities.article_count[0].value:null;

    var speechData = {
       Intent:intent,
       Category:category,
       Type : type,
       Count : count==null?3:count,
       Data:null
    }
    if(req.query.type=='first-interaction'){
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
    }
    else if(req.query.type=='after-read'){
        res.json(speechData);
    }
    else if(req.query.type=='endof-read-interaction'){
        var skip = req.query.skip;
        if(speechData.Intent=='read' || speechData.Intent=='continue'){
            //Skip ve limite göre data dönmem lazım. Kategori
            if(speechData.Category!=null){
            Article.find({Category:speechData.Category}).skip(skip).limit(speechData.Count).then(function(dic){
                console.log(dic);
                speechData.Data = dic;
                res.json(speechData);

            });
        }else{ 
            Article.find({}).skip(skip).limit(speechData.Count).exec(function(err,dic){
                console.log('else '+dic);
                speechData.Data = dic;
                res.json(speechData); 
            });
        }
        }
        else if(speechData.Intent=='no' || speechData.Intent=='stop'){
            res.json(speechData);
        }
    }

});

});

module.exports = router;