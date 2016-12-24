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
/* GET home page. Test */ 
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

    if(type==null && request_type=="endof-read-interaction" && req.query.speechType!=null){
        type = req.query.speechType;
    }

    var count = data.entities.article_count!=undefined?data.entities.article_count[0].value:null;

    var location = data.entities.article_location!=undefined?data.entities.article_location[0].value:null;
    if(request_type=="endof-read-interaction" && intent=='read'){
                if(req.query.location!=null){
                    location = req.query.location;
                }
            }

    var writer = data.entities.article_writer!=undefined?data.entities.article_writer[0].value:null;

    var emotion = data.entities.article_emotion!=undefined?data.entities.article_emotion[0].value:null;
        if(category!=null){
        try{
        var n = parseInt(category);
        count=n;
        category = null;
        }
        catch(ex){}
        }
    
    var speechData = {
       Intent:intent,
       Category:category,
       Type : type,
       Count : count==null?3:count,
       Data:null,
       Error :false,
       Message : null,
       Location:location,
       Writer:writer,
       Emotion:emotion==null?null:emotion.trim()
    }
    //Test Test
    if(request_type=='first-interaction'){
        if(speechData.Intent=='read'){
            if(speechData.Type=='column'){
                if(speechData.Writer!=null){
                    
                    var q = ".*"+speechData.Writer.trim()+".";
                    var query = { WriterName: {$regex:q , $options:"i"} };
                    if(speechData.Emotion!=null){
                        //query.Emotion=speechData.Emotion;
                    }

                    Column.find(query).sort({Date:-1}).limit(speechData.Count).exec(function(err,dic){
                        console.log(dic);
                        speechData.Data = dic;
                        speechData.Message=speechData.Writer +' yazarına ait '+speechData.Count+' köşe yazısı okunuyor.';
                        res.json(speechData);

                    });
                    }
                    else{
                        var query = { };
                        if(speechData.Emotion!=null){
                            //query.Emotion=speechData.Emotion;
                        }
                        Column.find(query).sort({Date:-1}).sort({Date:-1}).limit(speechData.Count).exec(function(err,dic){
                            console.log('else '+dic);
                            speechData.Data = dic;
                            speechData.Message='Son '+speechData.Count+' köşe yazısı okunuyor.';
                            res.json(speechData); 
                        });
                    }
            }
            else{
                if(speechData.Category!=null){
                    var query = { };
                        if(speechData.Emotion!=null){
                            query.Emotion=speechData.Emotion;
                        }
                        query.Path = {$regex: ".*"+enChars(speechData.Category)+".", $options:"i"};
                        //{ Path: {$regex: ".*"+enChars(speechData.Category)+".", $options:"i"} }
                    Article.find(query).sort({Date:-1}).limit(speechData.Count).exec(function(err,dic){
                        console.log(dic);
                        speechData.Data = dic;
                        res.json(speechData);

                    });
                }
                else if(speechData.Location!=null){
                    var query = { };
                        if(speechData.Emotion!=null){
                            query.Emotion=speechData.Emotion;
                        }
                    var q = ".*yerel-haberler/"+enChars(speechData.Location).trim()+".";
                    query.Path = {$regex:q , $options:"i"};
                    //{ Path: {$regex:q , $options:"i"} }
                    Article.find(query).sort({Date:-1}).limit(speechData.Count).exec(function(err,dic){
                        console.log(dic);
                        speechData.Data = dic;
                        res.json(speechData);

                    });

                }else{ 
                    var query = { };
                        if(speechData.Emotion!=null){
                            query.Emotion=speechData.Emotion;
                        }
                    Article.find(query).sort({Date:-1}).limit(speechData.Count).exec(function(err,dic){
                        console.log('else '+dic);
                        speechData.Data = dic;
                        res.json(speechData); 
                    });
                }
        }
    }
    else if(speechData.Intent == 'search'){
        var query = { };
                        if(speechData.Emotion!=null){
                            query.Emotion=speechData.Emotion;
                        }
                        query.$text = { $search : speechData.Category };
                        //{ $text : { $search : speechData.Category } }
        Article.find(query).sort({Date:-1}).limit(speechData.Count).exec(function(err,dic){
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
            if(speechData.Type=='column'){
                if(speechData.Writer!=null){
                    var query = { };
                        if(speechData.Emotion!=null){
                            //query.Emotion=speechData.Emotion;
                        }
                        query.WriterName = {$regex:q , $options:"i"};
                        //{ WriterName: {$regex:q , $options:"i"} }
                Column.find(query).sort({Date:-1}).skip(parseInt(skip)).limit(parseInt(speechData.Count)).exec(function(err,dic){
                        console.log(dic);
                        speechData.Data = dic;
                        speechData.Message=speechData.Writer +' yazarına ait '+speechData.Count+' köşe yazısı okunuyor.';
                        res.json(speechData);

                    });
                    }
                    else{
                        var query = { };
                        if(speechData.Emotion!=null){
                            //query.Emotion=speechData.Emotion;
                        }
                        Column.find(query).sort({Date:-1}).skip(parseInt(skip)).limit(parseInt(speechData.Count)).exec(function(err,dic){
                        console.log('else '+dic);
                        speechData.Data = dic;
                        speechData.Message='Son '+speechData.Count+' köşe yazısı okunuyor.';
                        res.json(speechData); 
                    });
                    }
            }
            else{
                    if(speechData.Category!=null){
                        var query = { };
                        if(speechData.Emotion!=null){
                            query.Emotion=speechData.Emotion;
                        }
                        query.Path = {$regex: ".*"+enChars(speechData.Category)+".", $options:"i"};
                        //{Path: {$regex: ".*"+enChars(speechData.Category)+".", $options:"i"}}
                    Article.find(query).skip(parseInt(skip)).limit(parseInt(speechData.Count)).exec(function(err,dic){
                        console.log(dic);
                        speechData.Data = dic;
                        res.json(speechData);

                    });
                     }else{ 
                         var query = { };
                        if(speechData.Emotion!=null){
                            query.Emotion=speechData.Emotion;
                        }
                    Article.find(query).sort({Date:-1}).skip(parseInt(skip)).limit(parseInt(speechData.Count)).exec(function(err,dic){
                        console.log('else '+dic);
                        speechData.Data = dic;
                        res.json(speechData); 
                    });
                }
        }
        }
        else if(speechData.Intent=='no' || speechData.Intent=='stop'){
            res.json(speechData);
            //Deneme
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
