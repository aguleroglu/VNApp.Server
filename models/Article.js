var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articleSchema = new Schema({

    Title:String,
    Description:String,
    Text:String,
    Category:String,
    Emotion:String,
    City:String,
    Path:String,
    ImageUrl:String,
    Date:Date

});
articleSchema.index({'$**': 'text'});
var Article = mongoose.model('Article', articleSchema);

// make this available to our users in our Node applications
module.exports = Article;