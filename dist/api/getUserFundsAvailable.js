'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controller = require('../redis/controller');

var _controller2 = _interopRequireDefault(_controller);

var _logger = require('../utils/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getUserFundsAvailable(userEmail) {
  var action = 'getting funds available of user ' + userEmail;
  (0, _logger.logInitiate)(action);
  try {
    var redisClient = new _controller2.default();
    var userDataJSON = await redisClient.fetchObjectByKeyFromRedis(userEmail);
    var userData = JSON.parse(userDataJSON);
    var userFundsAvailable = userData.fundsAvailable;
    return userFundsAvailable;
  } catch (err) {
    (0, _logger.logError)(action, err);
  }
}

exports.default = getUserFundsAvailable;