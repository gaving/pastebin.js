(function() {

    var express = require('express')
    , app = express.createServer()
    , _ = require('underscore')
    , Paste = require('./models/paste')
    , Util = require('./models/util');

    app.configure(function() {
        app.use(express.compiler({
            src: __dirname + '/public',
            enable: ['sass']
        }));
        app.use(express.logger());
        app.use(express.methodOverride());
        app.use(express.static(__dirname + '/public'));
        app.use(express.bodyParser());
        app.use(express.cookieParser());
    });

    app.configure('development', function() {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });

    app.configure('production', function() {
        app.use(express.errorHandler());
    });

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.get('/', function(req, res) {
        res.redirect('/pastes')
    });

    app.get('/pastes', function(req, res) {
        Paste.find({ private: false }).sort('_id', 'descending').limit(5).find(function(err, pastes) {
            res.render('pastes/index', {
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
            res.render('pastes/show', {
                locals: { d: d }
            });
        });
    });

    app.post('/pastes', function(req, res) {
        var paste = new Paste(req.body.paste);
        paste.save(function(e) {
            res.redirect('/pastes/' + paste._id)
        });
    });

    app.post('/lines', function(req, res) {
        console.log(req.body);
        //var paste = new Paste(req.body.paste);
        //paste.save(function() {
            //res.redirect('/pastes')
        //});
    });

    app.del('/pastes/:id', function(req, res) {
        Paste.findOne({ _id: req.params.id }, function(err, d) {
            if (!d) return next(new NotFound('Document not found'));
            d.remove(function() {
                req.flash('info', 'Paste deleted');
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
        res.render('500', {
            locals: { },
            status: 500
        });
    });

    app.listen(process.env.PORT || 8000);

    var io = require('socket.io').listen(app)
        , connections = {};

    io.configure('production', function() {
        io.enable('browser client etag');
        io.set('log level', 1);
    });

    io.sockets.on('connection', function(socket) {
        connections[socket.id] = {
            'id' : socket.id,
            'hash' : Util.ipHash(socket.id)
        };

        socket.emit('connections', connections);
        socket.broadcast.emit('join', connections[socket.id]);

        socket.on('disconnect', function () {
            if (!socket.id) return;
            delete connections[socket.id];
            console.log(socket.id + " disconnected");
            socket.broadcast.emit('disconnect', {
                'id' : socket.id
            });
        });
    });
})();
