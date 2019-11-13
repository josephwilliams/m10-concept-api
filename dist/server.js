'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redisClient = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _herokuSslRedirect = require('heroku-ssl-redirect');

var _herokuSslRedirect2 = _interopRequireDefault(_herokuSslRedirect);

var _controller = require('./redis/controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var app = (0, _express2.default)();
var redisClient = exports.redisClient = new _controller2.default();

// enable cors
app.use((0, _cors2.default)());

// enable ssl redirect
app.use((0, _herokuSslRedirect2.default)());

// TODO: setup basicAuthMiddleware
// app.use(basicAuthMiddleware);

app.use('/', _router2.default);

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  return console.log('Listening on port ' + PORT + '!');
});