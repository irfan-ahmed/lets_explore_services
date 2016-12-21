/**
 * Created by irahmed on 12/19/16.
 */

var redis = require("redis");
var keys = require("./keys");
var when = require("when");

// Redis Connection
var client = redis.createClient(keys.redis.port, keys.redis.host, {
  auth_pass: keys.redis.password,
  return_buffers: true
}).on("error", function (err) {
  console.log("Redis Connection Error: ", err);
});

module.exports.fromRedis = function (key) {
  if (!key) {
    return when.reject();
  }
  key = module.exports.normalizeKey(key);
  return when.promise(function (resolve, reject) {
    client.get(key, function (err, reply) {
      if (err || !reply) {
        if (err) {
          console.log("Error in redis.get", err);
        }
        return reject();
      }
      console.log("Return from redis: ", key);
      resolve(JSON.parse(reply));
    })
  })
};

module.exports.toRedis = function (key, value, expires) {
  if (!key || !value) {
    return null;
  }
  key = module.exports.normalizeKey(key);
  client.set(key, JSON.stringify(value), function (err) {
    if (!err) {
      client.expire(key, expires || 24 * 60 * 60, redis.print);
    }
  })
};

module.exports.normalizeKey = function (key) {
  if (!key) {
    return key;
  }
  return key.trim().toLowerCase();
};

module.exports.getAPIKey = function (service) {
  return keys.api[service];
};

