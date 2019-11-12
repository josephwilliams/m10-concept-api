'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _getUserDataByEmail = require('./api/getUserDataByEmail');

var _getUserDataByEmail2 = _interopRequireDefault(_getUserDataByEmail);

var _uploadFundsToUser = require('./api/uploadFundsToUser');

var _uploadFundsToUser2 = _interopRequireDefault(_uploadFundsToUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express.Router();
router.use((0, _express.json)());

router.get('/user/:userEmail', async function (req, res, next) {
  try {
    var userEmail = req.params.userEmail;

    var result = await (0, _getUserDataByEmail2.default)(userEmail);
    res.json(result);
  } catch (err) {
    res.json({
      error: err.toString()
    });
    next(err);
  }
});

router.post('/upload-funds', async function (req, res, next) {
  try {
    var _req$body = req.body,
        userEmail = _req$body.userEmail,
        userInstitution = _req$body.userInstitution,
        amount = _req$body.amount;

    var result = await (0, _uploadFundsToUser2.default)({ userEmail: userEmail, userInstitution: userInstitution, amount: amount });
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