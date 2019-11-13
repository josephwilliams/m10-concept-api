'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('../utils/logger');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _getUserFundsAvailable = require('./getUserFundsAvailable');

var _getUserFundsAvailable2 = _interopRequireDefault(_getUserFundsAvailable);

var _getUserTransferHistory = require('./getUserTransferHistory');

var _getUserTransferHistory2 = _interopRequireDefault(_getUserTransferHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function loadFundsToUser(_ref) {
  var userEmail = _ref.userEmail,
      userInstitution = _ref.userInstitution,
      amount = _ref.amount,
      redisClient = _ref.redisClient;

  var action = 'uploading funds ($' + amount + ') to user: ' + userEmail;
  (0, _logger.logInitiate)(action);
  try {
    // update user 'fundsAvailable' value
    var userAvailableFunds = await (0, _getUserFundsAvailable2.default)({ userEmail: userEmail, redisClient: redisClient });
    var sumFunds = Number(userAvailableFunds) + Number(amount);
    await redisClient.setObjectKeyToRedis(userEmail, 'fundsAvailable', String(sumFunds));

    // update user fund uploads transaction history
    var userTransferHistory = await (0, _getUserTransferHistory2.default)({ userEmail: userEmail, redisClient: redisClient });
    var fundsLoaded = userTransferHistory.fundsLoaded;

    var fundsLoadedArr = JSON.parse(fundsLoaded);
    var timeNow = (0, _moment2.default)().format();
    var fundsLoadedObj = {
      senderEmail: userEmail,
      time: timeNow,
      amount: amount,
      institution: userInstitution,
      type: 'LOAD'
    };
    fundsLoadedArr.unshift(fundsLoadedObj);
    var fundsLoadedArrStr = JSON.stringify(fundsLoadedArr);
    await redisClient.setObjectKeyToRedis(userEmail, 'fundsLoaded', fundsLoadedArrStr);

    (0, _logger.logSuccess)(action);
  } catch (err) {
    (0, _logger.logError)(action, err);
  }
}

exports.default = loadFundsToUser;