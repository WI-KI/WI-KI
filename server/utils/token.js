var CONFIG = require('../../config-server');
var jwt = require('jsonwebtoken');
var redis = require("./redis");

function getDelToken(token) {
    return [CONFIG.redis.prefix, "del", "token", token].join("-"); 
}

var token = {

    signToken: (obj) => {
        return new Promise((resolve, reject) => {
            jwt.sign(obj, CONFIG.jwt.secretOrPrivateKey, {
                expiresIn: CONFIG.jwt.expiresIn
            }, (err, data) => {
                resolve(data);
            });
        });
    },

    verifyToken: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, CONFIG.jwt.secretOrPrivateKey, function(err, decoded){
                if (err) {
                    resolve(null);
                } else {
                    resolve(decoded);
                }
            })
        });
    },

    delToken: async (token) => {
        return new Promise(async (resolve, reject) => {
            var key = getDelToken(token);
            await redis.set(key, "1", CONFIG.jwt.expiresIn);
            resolve();
        });
    },

    isDelToken: async (token) => {
        return new Promise(async (resolve, reject) => {
            var key = getDelToken(token);
            var value = await redis.get(key);
            if (value && value == "1") {
                resolve(true);
            }
            resolve(false);
        })
    },

    auth: async (req, res, next) => {
        if (req.token && req.token != "") {
            next();
        } else {
            res.status(401).end();
        }
    }
}

module.exports = token;