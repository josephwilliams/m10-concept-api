'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controller = require('../redis/controller');

var _controller2 = _interopRequireDefault(_controller);

var _logger = require('../utils/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getUserTransferHistory(_ref) {
  var userEmail = _ref.userEmail,
      redisClient = _ref.redisClient;

  var action = 'getting fund transfer history of user ' + userEmail;
  (0, _logger.logInitiate)(action);
  try {
    var _redisClient = _redisClient || new _controller2.default();
    var userData = await _redisClient.fetchObjectByKeyFromRedis(userEmail);
    // TODO: refactor this such that each transfer is a separate key to keep json response shorter
    (0, _logger.logSuccess)(action);
    return userData;
  } catch (err) {
    (0, _logger.logError)(action, err);
  }
}

exports.default = getUserTransferHistory;