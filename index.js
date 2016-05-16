var express = require('express');
var bodyParser  = require('body-parser');
var Promise = require('promise');
var uuid = require("./lib/uuid");
var fs = require("fs");

var app = express();
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,HEAD,OPTIONS,PUT,DELETE");
    next();
});

var dbSource = "./db/articles.json"

app.get('/articles', function (req, res, next) {
    var articles = JSON.parse(fs.readFileSync(dbSource, 'utf8'));
    console.log('get all', articles.length);
    res.json(articles);
});

app.post('/articles', function (req, res, next) {
    var body = req.body || {}
    console.log("message", body);

    if(!body.header || body.header === "" || !body.content || body.content === "") {
        return res.status(400).send({ message: "header and header are required"})
    }

    body.id = uuid();
    body.timestamp = Date.now();
    var articles = JSON.parse(fs.readFileSync(dbSource, 'utf8'));
    articles.push(body);

    fs.writeFile( dbSource, JSON.stringify(articles), "utf8", function(err, data) {
        if(err) return res.status(400).send(err)
        else return res.status(200).send({ message: "article is saved"});
    });
});

app.post('/articles/:id', function (req, res, next) {
    var articles = JSON.parse(fs.readFileSync(dbSource, 'utf8'));

    articles = articles.map(function(article){
        if(article.id === req.params.id){
            Object.assign(article, req.body)
        }
        return article;
    });

    fs.writeFile( dbSource, JSON.stringify(articles), "utf8", function(err, data) {
        if(err) return res.status(400).send(err)
        else return res.status(200).send({ message: "article is updated"});
    });
});

app.delete('/articles/:id', function (req, res, next) {
    var articles = JSON.parse(fs.readFileSync(dbSource, 'utf8'));

    console.log('before', articles.length);
    articles = articles.filter(function(article){
        if(article.id === req.params.id) console.log( article.id, req.params.id);

        return article.id !== req.params.id
    });
    console.log('after', articles.length);

    fs.writeFile( dbSource, JSON.stringify(articles), "utf8", function(err, data) {
        console.log("delete done", err, data);

        if(err) return res.status(400).send(err)
        else return res.status(200).send({ message: "article is deleted"});
    });
});

var port = process.env.PORT || 8080
var server = app.listen(port, function () {
    console.log('Listening at port %s', port);
})
module.exports = server
