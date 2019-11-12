'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controller = require('../redis/controller');

var _controller2 = _interopRequireDefault(_controller);

var _logger = require('../utils/logger');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _getUserFundsAvailable = require('./getUserFundsAvailable');

var _getUserFundsAvailable2 = _interopRequireDefault(_getUserFundsAvailable);

var _getUserTransferHistory = require('./getUserTransferHistory');

var _getUserTransferHistory2 = _interopRequireDefault(_getUserTransferHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function uploadFundsToUser(_ref) {
  var userEmail = _ref.userEmail,
      userInstitution = _ref.userInstitution,
      amount = _ref.amount;

  var action = 'uploading funds ($' + amount + ') to user: ' + userEmail;
  (0, _logger.logInitiate)(action);
  try {
    // update user 'fundsAvailable' value
    var userAvailableFunds = await (0, _getUserFundsAvailable2.default)(userEmail);
    var sumFunds = Number(userAvailableFunds) + Number(amount);
    var redisClient = new _controller2.default();
    await redisClient.setObjectKeyToRedis(userEmail, 'fundsAvailable', String(sumFunds));

    // update user fund uploads transaction history
    var userTransferHistory = await (0, _getUserTransferHistory2.default)({ userEmail: userEmail, redisClient: redisClient });
    var fundsUploaded = userTransferHistory.fundsUploaded;

    var fundsUploadedArr = JSON.parse(fundsUploaded);
    var timeNow = (0, _moment2.default)().format();
    var fundsUploadedObj = {
      senderEmail: userEmail,
      time: timeNow,
      amount: amount,
      institution: userInstitution
    };
    fundsUploadedArr.push(fundsUploadedObj);
    var fundsUploadedArrStr = JSON.stringify(fundsUploadedArr);
    await redisClient.setObjectKeyToRedis(userEmail, 'fundsUploaded', fundsUploadedArrStr);

    (0, _logger.logSuccess)(action);
  } catch (err) {
    (0, _logger.logError)(action, err);
  }
}

exports.default = uploadFundsToUser;