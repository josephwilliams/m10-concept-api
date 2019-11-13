'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('../utils/logger');

var _getUserTransferHistory = require('./getUserTransferHistory');

var _getUserTransferHistory2 = _interopRequireDefault(_getUserTransferHistory);

var _getUserFundsAvailable = require('./getUserFundsAvailable');

var _getUserFundsAvailable2 = _interopRequireDefault(_getUserFundsAvailable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getBlankUserFieldsStr(email) {
  var blankUserFields = {
    email: email,
    fundsAvailable: 0,
    fundsLoaded: [],
    fundsSent: [],
    fundsReceived: [],
    fundsUnloaded: []
  };

  return JSON.stringify(blankUserFields);
}

async function getUserDataByEmail(_ref) {
  var userEmail = _ref.userEmail,
      redisClient = _ref.redisClient;

  var action = 'getting data of user: ' + userEmail;
  (0, _logger.logInitiate)(action);
  try {
    if (!userEmail) {
      throw new Error('no userEmail provided.');
      return {};
    }

    // check if user (key) exists
    var isUser = await redisClient.checkRedisKey(userEmail);

    var userData = {};
    if (isUser) {
      // if user, return user data
      var userTransferHistory = await (0, _getUserTransferHistory2.default)({ userEmail: userEmail, redisClient: redisClient });
      var fundsAvailable = userTransferHistory.fundsAvailable,
          fundsLoaded = userTransferHistory.fundsLoaded,
          fundsSent = userTransferHistory.fundsSent,
          fundsReceived = userTransferHistory.fundsReceived,
          fundsUnloaded = userTransferHistory.fundsUnloaded;

      userData = {
        email: userEmail,
        fundsAvailable: fundsAvailable,
        fundsLoaded: fundsLoaded,
        fundsSent: fundsSent,
        fundsReceived: fundsReceived,
        fundsUnloaded: fundsUnloaded
      };
    } else {
      // if no user, set user (key) with blank fields
      // NOTE: redis is only capable of storing simple string pairs
      await redisClient.storeObjectToRedis(userEmail, {
        'email': userEmail,
        'fundsAvailable': '0',
        'fundsLoaded': '[]',
        'fundsSent': '[]',
        'fundsReceived': '[]',
        'fundsUnloaded': '[]'
      });

      userData = getBlankUserFieldsStr(userEmail);
    }

    (0, _logger.logSuccess)(action);
    return userData;
  } catch (err) {
    (0, _logger.logError)(action, err);
    return {
      error: err
    };
  }
}

exports.default = getUserDataByEmail;