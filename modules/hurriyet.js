var http = require('https');
var odata = require('odata-client');
var Article = require('../models/Article.js');
var hurriyet = function(){

    var self = {};
    self.enChars = function(txt){
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

    };
    self.emotionalizer = function(){
        Article.find({Emotion:null}).exec(function(err,dic){
            var arr = [];
            arr.push(dic.Text);
            var data = {text_list:arr};
            var post_options = {
                url:'https://api.monkeylearn.com/v2/classifiers/cl_eNJhqnTf/classify/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token 249c8df93f28cd2c36a1d21b4fe41ffcc41c390f'
                }
  };
        });
    }
self.syncArticles = function(){
    self.getArticles(function(response){

        response.forEach(function(element) {
            Article.findOne({ArticleId:element.Id}).exec(function(err,dic){

                if(err==null && dic==undefined){
                    self.getSingleArticle(ele.Id,function(art){
                        var article = new Article({
                            ArticleId:art.articleId,
                            Title:art.Title,
                            Text:art.Text,
                            Description:art.Description,
                            Path:art.Path,
                            Date:art.Date,
                            ImageUrl:art.Files!=null?art.Files[0].ImageUrl:""
                        });
                        article.save();

                    })
                    
                }

            })
        }, this);

    })
}
 //"path": "/v1/"+apiUrl+"?%24top="+l+"&%24select="+select,
self.options = function(apiUrl,articleId,top,select,filter){
 var options = {
    "method": "GET",
    "hostname": "api.hurriyet.com.tr",
    "port": null,
    "path": "/v1/"+apiUrl+articleId+top+select+filter,
    "headers": {
        "accept": "application/json",
        // "apikey": "e7de90624f1c4d01b404ba44b2d2d865"
        "apikey": "327c396d84c9491982f32e7c3625f908"
        
    }
};
return options;
}

self.getListPaths = function(callback){
    var q = odata({service: 'https://api.hurriyet.com.tr/v1/', resources: 'paths',headers:{apikey:'e7de90624f1c4d01b404ba44b2d2d865'}});
    q.get().then(function(response){

        callback(response.body);

    });
}

self.getArticles = function(callback){

var q = odata({service: 'https://api.hurriyet.com.tr/v1/articles?top=50',headers:{apikey:'327c396d84c9491982f32e7c3625f908'}});
q.select('Id').select('Title');

// for(var s in select){
//     q.select(select[s]);
// }
// if(filter!=null){
// q = q.filter("Path eq '/"+self.enChars(filter)+"/'");
// }
        q.get().then(function(response){

            callback(JSON.parse(response.body));

        });
    }

    self.getSingleArticle = function(articleId,callback)
    {

var q = odata({service: 'https://api.hurriyet.com.tr/v1/articles/'+articleId,headers:{apikey:'e7de90624f1c4d01b404ba44b2d2d865'}});
        q.get().then(function(response){

            callback(JSON.parse(response.body));

        });
    }

    return self; 
}

module.exports =hurriyet();