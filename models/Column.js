var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var columnSchema = new Schema({

    Title:String,
    Description:String,
    Text:String,
    Category:String,
    Emotion:String,
    City:String,
    Path:String,
    ImageUrl:String,
    WriterId:String,
    WriterName:String,
    Date:Date

});
columnSchema.index({'$**': 'text'});
var Column = mongoose.model('Column', columnSchema);

// make this available to our users in our Node applications
module.exports = Column;