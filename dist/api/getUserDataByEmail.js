'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controller = require('../redis/controller');

var _controller2 = _interopRequireDefault(_controller);

var _logger = require('../utils/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var blankUserFields = {
  fundsAvailable: 0,
  fundsUploaded: [],
  fundsSent: [],
  fundsReceived: []
};

var blankUserFieldsStr = JSON.stringify(blankUserFields);

async function getUserDataByEmail(userEmail) {
  var action = 'getting data of user: ' + userEmail;
  (0, _logger.logInitiate)(action);
  try {
    var redisClient = new _controller2.default();
    // check if user (key) exists
    var isUser = await redisClient.checkRedisKey(userEmail);

    var userData = {};
    if (isUser) {
      // if user, return user data
      userData = await redisClient.fetchObjectByKeyFromRedis(userEmail);
    } else {
      // if no user, set user (key) with blank fields
      // NOTE: redis is only capable of storing simple string pairs
      await redisClient.storeObjectToRedis(userEmail, {
        'fundsAvailable': '0',
        'fundsUploaded': '[]',
        'fundsSent': '[]',
        'fundsReceived': '[]'
      });
      userData = blankUserFields;
    }

    return userData;
  } catch (err) {
    (0, _logger.logError)(action, err);
    return {
      error: err
    };
  }
}

exports.default = getUserDataByEmail;