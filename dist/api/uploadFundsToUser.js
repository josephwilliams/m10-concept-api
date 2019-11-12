'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controller = require('../redis/controller');

var _controller2 = _interopRequireDefault(_controller);

var _logger = require('../utils/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function uploadFundsToUser(_ref) {
  var userEmail = _ref.userEmail,
      amount = _ref.amount;

  var action = 'uploading funds ($' + amount + ') to user: ' + userEmail;
  (0, _logger.logInitiate)(action);
  try {
    // const userData = await redisClient.fetchObjectByKeyFromRedis(userEmail);
    // return JSON.parse(userData);
  } catch (err) {
    (0, _logger.logError)(action, err);
    var errMessage = lodashGet(err, 'response.data.message');
    return {
      error: errMessage
    };
  }
}

exports.default = uploadFundsToUser;