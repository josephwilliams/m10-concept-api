'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('../utils/logger');

var axios = require('axios');
var lodashGet = require('lodash/get');
// import RedisClient from '../redis/controller';


async function uploadFundsToUser(_ref) {
  var userEmail = _ref.userEmail,
      amount = _ref.amount;

  var action = 'getting data of user: ' + userEmail;
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