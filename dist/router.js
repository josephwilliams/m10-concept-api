'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _getUserDataByEmail = require('./api/getUserDataByEmail');

var _getUserDataByEmail2 = _interopRequireDefault(_getUserDataByEmail);

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
      error: err
    });
    next(err);
  }
});

router.get('/status', function (req, res, next) {
  res.json({ status: 'ok' });
  next();
});

exports.default = router;