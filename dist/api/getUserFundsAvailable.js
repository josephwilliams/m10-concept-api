'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controller = require('../redis/controller');

var _controller2 = _interopRequireDefault(_controller);

var _logger = require('../utils/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getUserFundsAvailable(_ref) {
  var userEmail = _ref.userEmail,
      redisClient = _ref.redisClient;

  var action = 'getting funds available of user ' + userEmail;
  (0, _logger.logInitiate)(action);
  try {
    var _redisClient = _redisClient || new _controller2.default();
    var userData = await _redisClient.fetchObjectByKeyFromRedis(userEmail);
    (0, _logger.logSuccess)(action);
    return (userData || {}).fundsAvailable;
  } catch (err) {
    (0, _logger.logError)(action, err);
  }
}

exports.default = getUserFundsAvailable;