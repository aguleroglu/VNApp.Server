var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var Article = require('../models/Article.js'); 
var Column = require('../models/Column.js'); 
enChars = function(txt){
        if(txt==null){
            return null;
        }
        txt = txt.toLowerCase();
        txt = txt.replace('ü','u');
        txt = txt.replace('ı','i');
        txt = txt.replace('ç','c');
        txt = txt.replace('ş','s');
        txt = txt.replace('ğ','g');

        return txt;

    } 
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

    if(intent=='search' | intent=='read'){
        if(request_type=="endof-read-interaction"){
            if(intent=='read'){
                if(req.query.category!=null){
                    category = req.query.category;
                }
            }
        }
        else{
            category = data.entities.location!=undefined?data.entities.location[0].value:null;
        }
    }
    if(data.entities.article_category!=undefined){
        category = data.entities.article_category!=undefined?data.entities.article_category[0].value:null;
    }

    var type = data.entities.type!=undefined?data.entities.type[0].value:null;
    var count = data.entities.article_count!=undefined?data.entities.article_count[0].value:null;

    var location = data.entities.article_location!=undefined?data.entities.article_location[0].value:null;
    if(request_type=="endof-read-interaction" && intent=='read'){
                if(req.query.location!=null){
                    location = req.query.location;
                }
            }

    var writer = data.entities.article_writer!=undefined?data.entities.article_writer[0].value:null;

    var speechData = {
       Intent:intent,
       Category:category,
       Type : type,
       Count : count==null?3:count,
       Data:null,
       Error :false,
       Message : null,
       Location:location,
       Writer:writer
    }
    
    if(request_type=='first-interaction'){
        if(speechData.Intent=='read'){
            if(speechData.Type=='column'){
                if(speechData.Writer!=null){
                    var q = ".*"+speechData.Writer.trim()+".";

                    Column.find({ WriterName: {$regex:q , $options:"i"} }).sort({Date:-1}).limit(speechData.Count).exec(function(err,dic){
                        console.log(dic);
                        speechData.Data = dic;
                        speechData.Message=speechData.Writer +' yazarına ait '+speechData.Count+' köşe yazısı okunuyor.';
                        res.json(speechData);

                    });
                    }
                    else{
                    Column.find({}).limit(speechData.Count).exec(function(err,dic){
                        console.log('else '+dic);
                        speechData.Data = dic;
                        speechData.Message='Son '+speechData.Count+' köşe yazısı okunuyor.';
                        res.json(speechData); 
                    });
                    }
            }
            else{
                if(speechData.Category!=null){
                    
                    Article.find({ Path: {$regex: ".*"+enChars(speechData.Category)+".", $options:"i"} }).sort({Date:-1}).limit(speechData.Count).exec(function(err,dic){
                        console.log(dic);
                        speechData.Data = dic;
                        res.json(speechData);

                    });
                }
                else if(speechData.Location!=null){
                    var q = ".*yerel-haberler/"+enChars(speechData.Location).trim()+".";
                    Article.find({ Path: {$regex:q , $options:"i"} }).sort({Date:-1}).limit(speechData.Count).exec(function(err,dic){
                        console.log(dic);
                        speechData.Data = dic;
                        res.json(speechData);

                    });

                }else{ 
                    Article.find({}).sort({Date:-1}).limit(speechData.Count).exec(function(err,dic){
                        console.log('else '+dic);
                        speechData.Data = dic;
                        res.json(speechData); 
                    });
                }
        }
    }
    else if(speechData.Intent == 'search'){
        Article.find({ $text : { $search : speechData.Category } }).sort({Date:-1}).limit(speechData.Count).exec(function(err,dic){
                console.log(dic);
                if(dic==null || dic.length==0){
                    speechData.Message = 'Böyle bir sonuç bulamadım.';
                    speechData.Error = true;
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
            if(speechData.Category!=null){
            Article.find({Path: {$regex: ".*"+enChars(speechData.Category)+".", $options:"i"}}).skip(parseInt(skip)).limit(parseInt(speechData.Count)).exec(function(err,dic){
                console.log(dic);
                speechData.Data = dic;
                res.json(speechData);

            });
        }else{ 
            Article.find({}).sort({Date:-1}).skip(parseInt(skip)).limit(parseInt(speechData.Count)).exec(function(err,dic){
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