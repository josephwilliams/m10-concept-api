'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controller = require('../redis/controller');

var _controller2 = _interopRequireDefault(_controller);

var _logger = require('../utils/logger');

var _getUserTransferHistory = require('./getUserTransferHistory');

var _getUserTransferHistory2 = _interopRequireDefault(_getUserTransferHistory);

var _getUserFundsAvailable = require('./getUserFundsAvailable');

var _getUserFundsAvailable2 = _interopRequireDefault(_getUserFundsAvailable);

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
      var userFundsAvailable = await (0, _getUserFundsAvailable2.default)(userEmail);
      var userTransferHistory = await (0, _getUserTransferHistory2.default)(userEmail);
      var fundsUploaded = userTransferHistory.fundsUploaded,
          fundsSent = userTransferHistory.fundsSent,
          fundsReceived = userTransferHistory.fundsReceived;

      userData = {
        fundsAvailable: userFundsAvailable,
        fundsUploaded: fundsUploaded,
        fundsSent: fundsSent,
        fundsReceived: fundsReceived
      };
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