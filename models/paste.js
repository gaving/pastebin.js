var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = mongoose.connect('mongodb://localhost/db'),
    rd = require('relative-date'),
    crypto = require("crypto");

var Paste = new Schema({
    author  : String
    , title : String
    , body  : String
    , lang  : { type: String, default: 'plain' }
    , date  : { type: Date, default: Date.now }
});

mongoose.model('Paste', Paste);

Paste.virtual('relative').get(function () {
    return rd(this.get('date'));
})

Paste.virtual('lines').get(function () {
    var m = this.get('body').match(/[^\n]*\n[^\n]*/gi);
    return m ? m.length : 1;
})

Paste.virtual('gravatar').get(function () {
    var author = this.get('author');
    if (author) {
        var hash = crypto.createHash("md5").update(author).digest("hex");
        return "http://www.gravatar.com/avatar/" + hash + "?s=25";
    }
    return null;
})

module.exports = db.model('Paste');

// middleware
//Paste.pre('save', function (next) {
    //console.log(this.get('body'));
    //next();
//});
