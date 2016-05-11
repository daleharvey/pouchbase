'use strict';

var mkdirp = require('mkdirp');

// Where our data is going to be stored
var DATA_DIR = __dirname + '/data/';
mkdirp.sync(DATA_DIR);

var express = require('express');
var app = express();
var PouchDB = require('pouchdb').defaults({prefix: DATA_DIR});

function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.end();
  } else {
    next();
  }
}

function reject(req, res, next) {
  res.status(401).send({error: true, message: 'Unauthorised'});
}

app.use(allowCrossDomain);
app.use(express.static(__dirname + '/public'));

// Reject design docs
app.use('/:db/_design/:name', reject);

// Send home page if needed
app.get('/', function (req, res, next) {
  if (req.accepts('html')) {
    return res.sendFile(__dirname + '/public/index.html');
  }
  next();
});

// Rest are handled by the database
app.use('/', require('pouchdb-express-router')(PouchDB));

app.listen(process.env.PORT || 3000);
