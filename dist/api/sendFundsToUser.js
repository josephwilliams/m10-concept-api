'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('../utils/logger');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _getUserDataByEmail = require('./getUserDataByEmail');

var _getUserDataByEmail2 = _interopRequireDefault(_getUserDataByEmail);

var _getUserFundsAvailable = require('./getUserFundsAvailable');

var _getUserFundsAvailable2 = _interopRequireDefault(_getUserFundsAvailable);

var _getUserTransferHistory = require('./getUserTransferHistory');

var _getUserTransferHistory2 = _interopRequireDefault(_getUserTransferHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function sendFundsToUser(_ref) {
  var userEmail = _ref.userEmail,
      recipientEmail = _ref.recipientEmail,
      userInstitution = _ref.userInstitution,
      amount = _ref.amount,
      redisClient = _ref.redisClient;

  var action = 'sending funds ($' + amount + ') to user ' + recipientEmail + ' from user ' + userEmail;
  (0, _logger.logInitiate)(action);
  try {
    // create recipient if not existent (for demo)
    await (0, _getUserDataByEmail2.default)({ userEmail: recipientEmail, redisClient: redisClient });

    // update userEmail (sender) 'fundsAvailable' value
    var senderAvailableFunds = await (0, _getUserFundsAvailable2.default)({ userEmail: userEmail, redisClient: redisClient });
    var sumFundsSender = Number(senderAvailableFunds) - Number(amount);
    await redisClient.setObjectKeyToRedis(userEmail, 'fundsAvailable', String(sumFundsSender));

    // update recipientEmail 'fundsAvailable' value
    var userAvailableFunds = await (0, _getUserFundsAvailable2.default)({ userEmail: recipientEmail, redisClient: redisClient });
    var sumFundsRecipient = Number(userAvailableFunds) + Number(amount);
    await redisClient.setObjectKeyToRedis(recipientEmail, 'fundsAvailable', String(sumFundsRecipient));

    // update user (sender) funds sent transaction history
    var senderTransferHistory = await (0, _getUserTransferHistory2.default)({ userEmail: userEmail, redisClient: redisClient });
    var fundsSent = senderTransferHistory.fundsSent;

    var fundsSentArr = JSON.parse(fundsSent);
    var timeNow = (0, _moment2.default)().format();
    var fundsSentObj = {
      senderEmail: userEmail,
      recipientEmail: recipientEmail,
      time: timeNow,
      amount: amount,
      institution: userInstitution,
      type: 'SEND'
    };
    fundsSentArr.unshift(fundsSentObj);
    var fundsSentArrStr = JSON.stringify(fundsSentArr);
    await redisClient.setObjectKeyToRedis(userEmail, 'fundsSent', fundsSentArrStr);

    // update recipient funds received transaction history
    var recipientTransferHistory = await (0, _getUserTransferHistory2.default)({ userEmail: recipientEmail, redisClient: redisClient });
    var fundsReceived = recipientTransferHistory.fundsReceived;

    var fundsReceivedArr = JSON.parse(fundsReceived);
    var fundsReceivedObj = {
      senderEmail: userEmail,
      recipientEmail: recipientEmail,
      time: timeNow,
      amount: amount,
      institution: userInstitution,
      type: 'RECEIVE'
    };
    fundsReceivedArr.unshift(fundsReceivedObj);
    var fundsReceivedArrStr = JSON.stringify(fundsReceivedArr);
    await redisClient.setObjectKeyToRedis(recipientEmail, 'fundsReceived', fundsReceivedArrStr);

    (0, _logger.logSuccess)(action);
  } catch (err) {
    (0, _logger.logError)(action, err);
  }
}

exports.default = sendFundsToUser;