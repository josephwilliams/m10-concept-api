'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logInitiate = logInitiate;
exports.logSuccess = logSuccess;
exports.logError = logError;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chalk2.default.enabled = true;
_chalk2.default.level = 3;

function logInitiate(action) {
  console.log(_chalk2.default.bold.black.bgCyan('[initiate]'), action);
}

function logSuccess(action) {
  console.log(_chalk2.default.bold.black.bgGreen('[ success ]'), _chalk2.default.green(action));
}

function logError(action, err) {
  console.log(_chalk2.default.bold.black.bgRed('[ error ]'), _chalk2.default.red(action), '\n', err);
}