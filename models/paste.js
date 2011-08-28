var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = mongoose.connect('mongodb://localhost/db'),
    rd = require('relative-date'),
    crypto = require("crypto");

var Line = new Schema({
    number     : Number
    , date     : Date
    , author   : String
});

mongoose.model('Line', Line);

var Paste = new Schema({
    author  : {
        type: String,
        default: 'example@example.com',
        set: function(email) {
            return crypto.createHash("md5").update(email).digest("hex");
        }
    }
    , hash : String
    , title : String
    , body  : String
    , lang  : { type: String, default: 'plain' }
    , date  : { type: Date, default: Date.now }
    , marks  : [Line]
    , theme  : { type: String, enum: ['Default', 'Django', 'Eclipse', 'Emacs', 'FadeToGrey', 'Midnight', 'RDark'], default: 'Default' }
    , private  : { type: Boolean, default: false }
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
    return "http://www.gravatar.com/avatar/" + this.get('author') + "?s=15";
})

module.exports = {paste:db.model('Paste'), line:db.model('Line')};

Paste.pre('save', function (next) {
    this.hash = crypto.createHash("md5").update(this.id).digest("hex").substring(0, 5).toUpperCase();
    console.log(this.get('_id') + ' saved');
    next();
});
