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

async function unloadFundsOfUser(_ref) {
  var userEmail = _ref.userEmail,
      userInstitution = _ref.userInstitution,
      amount = _ref.amount,
      redisClient = _ref.redisClient;

  var action = 'unloading funds ($' + amount + ') of user: ' + userEmail;
  (0, _logger.logInitiate)(action);
  try {
    // update user 'fundsAvailable' value
    var userAvailableFunds = await (0, _getUserFundsAvailable2.default)({ userEmail: userEmail, redisClient: redisClient });
    var sumFunds = Number(userAvailableFunds) - Number(amount);
    await redisClient.setObjectKeyToRedis(userEmail, 'fundsAvailable', String(sumFunds));

    // update user fund uploads transaction history
    var userTransferHistory = await (0, _getUserTransferHistory2.default)({ userEmail: userEmail, redisClient: redisClient });
    var fundsUnloaded = userTransferHistory.fundsUnloaded;

    var fundsUnloadedArr = JSON.parse(fundsUnloaded);
    var timeNow = (0, _moment2.default)().format();
    var fundsUnloadedObj = {
      senderEmail: userEmail,
      time: timeNow,
      amount: amount,
      institution: userInstitution,
      type: 'UNLOAD'
    };
    fundsUnloadedArr.push(fundsUnloadedObj);
    var fundsUnloadedArrStr = JSON.stringify(fundsUnloadedArr);
    await redisClient.setObjectKeyToRedis(userEmail, 'fundsUnloaded', fundsUnloadedArrStr);

    (0, _logger.logSuccess)(action);
  } catch (err) {
    (0, _logger.logError)(action, err);
  }
}

exports.default = unloadFundsOfUser;