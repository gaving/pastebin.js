var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = mongoose.connect('mongodb://localhost/db');

var Paste = new Schema({
    author  : String
    , title : String
    , body  : String
    , date  : {type  : Date, default : Date.now}
});

mongoose.model('Paste', Paste);

module.exports = db.model('Paste');
