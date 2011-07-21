(function() {
    var app, express, pub, relDate, _, md;
    express = require('express');
    pub = __dirname + '/public';
    Paste = require('./models/paste');
    relDate = require('relative-date');
    _ = require('underscore');
    md = require('markdown');
    app = express.createServer(express.compiler({
        src: pub,
        enable: ['sass']
    }), express.static(pub), express.bodyParser(), express.logger(), express.errorHandler({
        dumpExceptions: true,
        showStack: true
    })).set('view engine', 'jade');

    app.get('/', function(req, res) {
        res.redirect('/pastes')
    });

    app.get('/pastes', function(req, res) {
        Paste.find().sort('_id', 'descending').limit(5).find(function(err, pastes) {
            _.map(pastes, (function(paste) { paste.relative = relDate(paste.date); }));
            res.render('pastes/index.jade', {
                locals: { pastes: pastes }
            });
        });
    });

    app.get('/pastes/new', function(req, res) {
        return res.render('pastes/new', {
            locals: { paste : req.body && req.body.paste || new Paste() }
        });
    });

    app.get('/pastes/:id', function(req, res, next) {
        Paste.findOne({ _id: req.params.id }, function(err, d) {
            if (!d) return next(new NotFound('Paste not found'));
            res.render('pastes/show.jade', {
                locals: { d: d }
            });
        });
    });

    app.post('/pastes', function(req, res) {
        req.body.paste.body = md.parse(req.body.paste.body);
        var paste = new Paste(req.body.paste);
        paste.save(function() {
            res.redirect('/pastes')
        });
    });
    app.listen(process.env.PORT || 8000);
})();
