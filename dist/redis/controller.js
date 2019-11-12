'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _logger = require('../utils/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// NOTE: using redis with node: https://www.sitepoint.com/using-redis-node-js/
var RedisClient = function () {
  function RedisClient() {
    _classCallCheck(this, RedisClient);

    this.init();
    this.lists = {};
  }

  _createClass(RedisClient, [{
    key: 'init',
    value: function init() {
      this.client = (0, _init2.default)();
    }

    // store list/array

  }, {
    key: 'addListToRedis',
    value: async function addListToRedis(arr) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var action = 'adding list to redis: ' + arr[0];
        (0, _logger.logInitiate)(action);
        // first string in array is key, subsequent are strings to store
        _this.client.rpush(arr, function (err, reply) {
          if (err) {
            reject(err);
          }

          (0, _logger.logSuccess)(action);
          resolve(reply);
        });
      });
    }

    // fetch list by key

  }, {
    key: 'fetchListFromRedis',
    value: async function fetchListFromRedis(listKey) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var action = 'fetching list from redis: ' + listKey;
        (0, _logger.logInitiate)(action);
        var that = _this2;
        _this2.client.lrange(listKey, 0, -1, function (err, reply) {
          if (err) {
            reject(err);
          }

          that.lists[listKey] = reply;
          (0, _logger.logSuccess)(action);
          console.log('list:', reply);
          resolve(reply);
        });
      });
    }

    // remove item from list

  }, {
    key: 'deleteItemFromListInRedis',
    value: async function deleteItemFromListInRedis(listKey, listItemStr) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var action = 'deleting item from list: ' + listKey + ': ' + listItemStr;
        (0, _logger.logInitiate)(action);
        var that = _this3;
        _this3.client.lrem(listKey, -2, listItemStr, function (err, reply) {
          if (err) {
            reject(err);
          }

          (0, _logger.logSuccess)(action);
          resolve(reply);
        });
      });
    }

    // push item to list

  }, {
    key: 'pushItemToListInRedis',
    value: async function pushItemToListInRedis(listKey, listItemStr) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var action = 'pushing item to list: ' + listKey + ': ' + listItemStr;
        (0, _logger.logInitiate)(action);
        var that = _this4;
        _this4.client.lpush(listKey, listItemStr, function (err, reply) {
          if (err) {
            reject(err);
          }

          that.lists[listKey].push(listItemStr);
          (0, _logger.logSuccess)(action);
          resolve(reply);
        });
      });
    }

    // store object to redis by key

  }, {
    key: 'storeObjectToRedis',
    value: async function storeObjectToRedis(keyName, obj) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        // obj must be string key/value pairs, e.g. 'animal': 'dog'
        var action = 'storing object in redis: ' + keyName;
        _this5.client.hmset(keyName, obj, function (err, reply) {
          if (err) {
            reject(err);
          }

          (0, _logger.logSuccess)(action);
          resolve(reply);
        });
      });
    }

    // store object to redis by key

  }, {
    key: 'setObjectKeyToRedis',
    value: async function setObjectKeyToRedis(objectKey, key, newValue) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        // obj must be string key/value pairs, e.g. 'animal': 'dog'
        var action = 'setting object key value in redis: ' + objectKey + ':  ' + key + ': ' + newValue;
        _this6.client.hmset(objectKey, key, newValue, function (err, reply) {
          if (err) {
            reject(err);
          }

          (0, _logger.logSuccess)(action);
          resolve(reply);
        });
      });
    }

    // fetch object from redis by key

  }, {
    key: 'fetchObjectByKeyFromRedis',
    value: function fetchObjectByKeyFromRedis(key) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        var action = 'fetching object by key in redis: ' + key;
        _this7.client.hgetall(key, function (err, object) {
          if (err) {
            reject(err);
          }

          (0, _logger.logSuccess)(action);
          resolve(object);
        });
      });
    }

    // check existence of redis key

  }, {
    key: 'checkRedisKey',
    value: function checkRedisKey(key) {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        var action = 'checking key in redis: ' + key;
        _this8.client.exists(key, function (err, reply) {
          if (err) {
            reject(err);
          }

          (0, _logger.logSuccess)(action);
          if (reply === 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    }

    // delete redis item by key

  }, {
    key: 'deleteRedisKey',
    value: async function deleteRedisKey(key) {
      var _this9 = this;

      return new Promise(function (resolve, reject) {
        var action = 'deleting key in redis: ' + key;
        var that = _this9;
        _this9.client.del(key, function (err, reply) {
          if (err) {
            reject(err);
          }

          (0, _logger.logSuccess)(action);
          delete that.lists[key];
        });
      });
    }
  }]);

  return RedisClient;
}();

exports.default = RedisClient;