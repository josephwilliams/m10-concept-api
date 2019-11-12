'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// NOTE: heroku redis togo installation guide: https://devcenter.heroku.com/articles/redistogo#using-with-node-js
function initRedisClient() {
  var redisClient = void 0;
  if (process.env.REDISTOGO_URL) {
    var rtg = require('url').parse(process.env.REDISTOGO_URL);
    redisClient = require('redis').createClient(rtg.port, rtg.hostname);
    redisClient.auth(rtg.auth.split(":")[1]);
  } else {
    redisClient = require('redis').createClient();
  }

  redisClient.on('error', function (err) {
    console.log('redis client error ' + err);
  });

  return redisClient;
}

exports.default = initRedisClient;