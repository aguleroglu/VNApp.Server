var http = require('https');


var hurriyet = function(){

    var self = {};
 //"path": "/v1/"+apiUrl+"?%24top="+l+"&%24select="+select,
self.options = function(apiUrl,articleId,top,select,filter){
 var options = {
    "method": "GET",
    "hostname": "api.hurriyet.com.tr",
    "port": null,
    "path": "/v1/"+apiUrl+articleId+top+select+filter,
    "headers": {
        "accept": "application/json",
        "apikey": "e7de90624f1c4d01b404ba44b2d2d865"
    }
};
return options;
}

self.getArticles = function(top,select,filter,callback){
    var opt = self.options("articles","","?%24top="+top,"&%24select="+select+"&%24filter="+filter+"");
        var request = http.request(opt,function(res){
            var datas =  [];
            res.on("data",function(data){
                datas.push(data);
            });

            res.on("end",function(){
                var data = Buffer.concat(datas);
                //console.log(data.toString());
                callback(data.toString());
            });
        });
        request.end();
    }

    self.getSingleArticle = function(Id,select,callback)
    {
         var opt = self.options("articles",Id,"","?%24select="+select);
         var request = http.request(opt,function(res){
             var datas = [];
             res.on("data",function(data){
                 datas.push(data);
             });
             res.on("end",function(data){

                 var data = Buffer.concat(datas);
                 callback(data.toString());
             });
         });
         request.end();
    }

    return self; 
}

module.exports =hurriyet();