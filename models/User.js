var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({

    Email:String,
    Password:String,


});

var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;