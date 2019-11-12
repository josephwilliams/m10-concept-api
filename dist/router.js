'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _express = require('express');

var router = new _express.Router();
router.use((0, _express.json)());

router.get('/test', async function (req, res, next) {
  try {
    // const result = await something();

    res.json({
      action: 'doing something'
    });
  } catch (err) {
    console.log('>> ERROR', typeof err === 'undefined' ? 'undefined' : _typeof(err));
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