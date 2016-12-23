var http = require('https');
var odata = require('odata-client');

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
        "apikey": "e7de90624f1c4d01b404ba44b2d2d865"
    }
};
return options;
}

self.getArticles = function(top,select,filter,callback){

var q = odata({service: 'https://api.hurriyet.com.tr/v1/', resources: 'articles',headers:{apikey:'e7de90624f1c4d01b404ba44b2d2d865'}});
q.top(top).select('Id').select('Title');

for(var s in select){
    q.select(select[s]);
}
if(filter!=null){
q = q.filter("Path eq '/"+self.enChars(filter)+"/'");
}
q.get().then(function(response){

    callback(JSON.parse(response.body));

});

    // var f = filter!=null?("&%24filter=PATH%20eq%20'/"+filter+"/"):"";
    // var opt = self.options("articles","","?%24top="+top,"&%24select="+select,f);
    // console.log(opt);
    //     var request = http.request(opt,function(res){
    //         var datas =  [];
    //         res.on("data",function(data){
    //             datas.push(data);
    //         });

    //         res.on("end",function(){
    //             var data = Buffer.concat(datas);
    //             //console.log(data.toString());
    //             callback(JSON.parse(data.toString()));
    //         });
    //     });
    //     request.end();
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