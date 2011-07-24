(function() {
    var app, express, pub, _;
    express = require('express'),
    pub = __dirname + '/public',
    _ = require('underscore'),
    Paste = require('./models/paste');

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
            res.render('pastes/index.jade', {
                locals: { pastes: pastes }
            });
        });
    });

    app.get('/stats', function(req, res) {
        Paste.find().sort('_id', 'descending').find(function(err, pastes) {
            res.send({
                pastes: pastes.length,
                lines: _.reduce(pastes, function(memo, p) {
                    return memo + p.lines;
                }, 0)
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
            if (!d) return next(new Error('Paste not found'));
            res.render('pastes/show.jade', {
                locals: { d: d }
            });
        });
    });

    app.post('/pastes', function(req, res) {
        var paste = new Paste(req.body.paste);
        paste.save(function() {
            res.redirect('/pastes')
        });
    });

    app.del('/pastes/:id', function(req, res) {
        Paste.findOne({ _id: req.params.id }, function(err, d) {
            if (!d) return next(new NotFound('Document not found'));
            d.remove(function() {
                req.flash('info', 'Past deleted');
                res.redirect('/pastes');
            });
        });
    });

    app.post('/search', function(req, res) {
        Paste.find({ user_id: req.currentUser.id, keywords: req.body.s ? req.body.s : null }, [], { sort: ['title', 'descending'] }, function(err, documents) {
            res.send(documents.map(function(d) {
                return { title: d.title, id: d._id };
            }));
        });
    });

    app.error(function(err, req, res, next) {
        res.render('500.jade', {
            locals: { },
            status: 500
        });
    });

    app.listen(process.env.PORT || 8000);
})();
