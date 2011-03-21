
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var euAdmin = require('./components/admin').euAdmin;
var euAdmin = new euAdmin('localhost', 27017);

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'pass'}));
    app.use(app.router);
    app.use(express.static(__dirname + '/static'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
    res.render('index', {
        title: 'EU'
    });
});

app.get('/admin', function(req, res){
    euAdmin.getUsers(function(errors, data){
        res.render('admin', {
            title: 'Admin',
            users: data.users,
            groups: data.groups
        });
    });
});

app.post('/admin/adduser', function(req, res){
    euAdmin.addUser(
        {
            name: req.param('name'),
            group: req.param('group')
        },
        function(){
            res.redirect('/admin')
        }
    );
});
app.post('/admin/addgroup', function(req, res){
    euAdmin.addGroup(
        {
            name: req.param('name')
        },
        function(){
            res.redirect('/admin')
        }
    );
});
app.get('/admin/removeuser', function(req, res){
    euAdmin.removeUser(
        req.param('id'),
        function(){
            res.redirect('/admin')
        }
    );
});
app.get('/admin/removegroup', function(req, res){
    euAdmin.removeGroup(
        req.param('id'),
        function(){
            res.redirect('/admin')
        }
    );
});


if (!module.parent) {
  app.listen(3001);
  console.log("Express server listening on port %d", app.address().port)
}
