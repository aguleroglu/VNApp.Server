var http = require('http');

var hurriyet = function(){

    var self = {};

    self.getArticles = function(l,callback){

        callback(l);

    }

    return self;

}

module.exports =hurriyet();