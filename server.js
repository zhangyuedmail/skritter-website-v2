'use strict';

const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const loggy = require('loggy');
const morgan = require('morgan');

const app = express();
app.set('port', process.env.PORT || 3333);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression(6));
app.use(cors());
app.use(express.static(__dirname + '/public'));

if (process.env.DEVELOPMENT) {
  app.use(morgan('combined'));
} else {
  //TODO: production specific logic here
}

app.get(
  '/*',
  function(req, res) {
    res.render('index');
  }
);

app.listen(
  app.get('port'),
  function() {
    loggy.info('started application on port', app.get('port'));
  }
);
