var REDIS = require('redis');
var CONFIG = require('../../config-server');

function connect() {
    return new Promise((resolve, reject) => {
        var redisClient = REDIS.createClient(CONFIG.redis.port, CONFIG.redis.host);
        redisClient.auth(CONFIG.redis.password);
        redisClient.on("connect", (err) => {
            if (err) {
                resolve(null);
            } else {
                resolve(redisClient);
            }
        });
    });
}

var redis = {

    set: async (key, value, expire) => {
        return new Promise(async (resolve, reject) => {
            var client = await connect();
            client.set(key, value, (err, result) => {
                if (err) resolve(null);
                expire = parseInt(expire);
                if (!isNaN(expire) && expire > 0) {
                    client.expire(key, expire, () => {
                        resolve(result);
                    });
                } else {
                    resolve(result);
                }
            });
        });
    },

    get: async (key) => {
        return new Promise(async (resolve, reject) => {
            var client = await connect();
            client.get(key, (err, result) => {
                if (err) resolve(null);
                resolve(result);
            });
        });
    },

    del: async(key) => {
        return new Promise(async (resolve, reject) => {
            var client = await connect();
            client.del(key, (err, result) => {
                if (err) resolve(null);
                resolve(result);
            });
        });        
    }
}

module.exports = redis;