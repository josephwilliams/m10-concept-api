'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _getUserDataByEmail = require('./api/getUserDataByEmail');

var _getUserDataByEmail2 = _interopRequireDefault(_getUserDataByEmail);

var _loadFundsToUser = require('./api/loadFundsToUser');

var _loadFundsToUser2 = _interopRequireDefault(_loadFundsToUser);

var _unloadFundsOfUser = require('./api/unloadFundsOfUser');

var _unloadFundsOfUser2 = _interopRequireDefault(_unloadFundsOfUser);

var _sendFundsToUser = require('./api/sendFundsToUser');

var _sendFundsToUser2 = _interopRequireDefault(_sendFundsToUser);

var _server = require('./server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express.Router();
router.use((0, _express.json)());

router.get('/user/:userEmail', async function (req, res, next) {
  try {
    var userEmail = req.params.userEmail;

    var result = await (0, _getUserDataByEmail2.default)({
      userEmail: userEmail,
      redisClient: _server.redisClient
    });
    res.json(result);
  } catch (err) {
    res.json({
      error: err.toString()
    });
    next(err);
  }
});

router.post('/load-funds', async function (req, res, next) {
  try {
    var _req$body = req.body,
        userEmail = _req$body.userEmail,
        userInstitution = _req$body.userInstitution,
        amount = _req$body.amount;

    var result = await (0, _loadFundsToUser2.default)({
      userEmail: userEmail,
      userInstitution: userInstitution,
      amount: amount,
      redisClient: _server.redisClient
    });
    res.json(result);
  } catch (err) {
    res.json({
      error: err.toString()
    });
    next(err);
  }
});

router.post('/unload-funds', async function (req, res, next) {
  try {
    var _req$body2 = req.body,
        userEmail = _req$body2.userEmail,
        userInstitution = _req$body2.userInstitution,
        amount = _req$body2.amount;

    var result = await (0, _unloadFundsOfUser2.default)({
      userEmail: userEmail,
      userInstitution: userInstitution,
      amount: amount,
      redisClient: _server.redisClient
    });
    res.json(result);
  } catch (err) {
    res.json({
      error: err.toString()
    });
    next(err);
  }
});

router.post('/send-funds', async function (req, res, next) {
  try {
    var _req$body3 = req.body,
        userEmail = _req$body3.userEmail,
        recipientEmail = _req$body3.recipientEmail,
        userInstitution = _req$body3.userInstitution,
        amount = _req$body3.amount;

    var result = await (0, _sendFundsToUser2.default)({
      userEmail: userEmail,
      recipientEmail: recipientEmail,
      userInstitution: userInstitution,
      amount: amount,
      redisClient: _server.redisClient
    });
    res.json(result);
  } catch (err) {
    res.json({
      error: err.toString()
    });
    next(err);
  }
});

router.get('/status', function (req, res, next) {
  res.json({ status: 'ok' });
  next();
});

exports.default = router;