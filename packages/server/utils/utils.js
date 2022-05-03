var nodemailer  = require("nodemailer");
var CONFIG = require('../../config-server');
var jwt = require('jsonwebtoken');
var redis = require('redis');
var gravatar = require('gravatar');
var dbHandel = require('./db');
var moment = require("moment");

var utils = {

    trim: (str) => {
        return str.replace(/(^\s*)|(\s*$)/g, ""); 
    },

    getIP: (req) => {
        var item = (req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress || '')
                    .match(/\d+\.\d+\.\d+\.\d+/);
        return (item && item.length > 0) ? item[0] : "127.0.0.1";
    },

    sendEmail: (to, subject, text) => {
        return new Promise((resolve, reject) => {
            var smtpTransport = nodemailer.createTransport({
                host: CONFIG.email.host,
                port: CONFIG.email.post,
                auth: {
                    user: CONFIG.email.user,
                    pass: CONFIG.email.pass,
                    ssl:  CONFIG.email.ssl,
                }
            });
            smtpTransport.sendMail({
                from    : CONFIG.email.user,
                to      : to, // 收件人邮箱，多个邮箱地址间用','隔开
                subject : subject, //邮件主题
                text: text, //text和html两者只支持一种
            }, function(err, res) {
                if (res) resolve(res);
                if (err) reject(err);
            });
        });
    },

    ismail: (mail) => {
        var regex = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
        return regex.test(mail);
    },

    validUsername: (username) => {
        var regex = /^\w{4,12}$/
        return regex.test(username);
    },

    validPassword: (password) => {
        var regex = /^\w{4,20}$/
        return regex.test(password);
    },

    gravatar: (email) => {
        return gravatar.url(email, {protocol: "https", r: 'x'});
    },

    getUser: (item) => {
        return {
            username: item.username,
            password: item.password,
            email: item.email,
            school: item.school,
            auth: item.auth,
            datetime: item.datetime,
            name: item.name,
            imgUrl: gravatar.url(item.email, {protocol: "https", r: 'x'}),
            secret: CONFIG.jwt.secretOrPrivateKey,
        };
    },

    md5: (data) => {
        var crypto = require('crypto');
        var md5 = crypto.createHash('md5');
        md5.update(data);
        return md5.digest('hex');
    },

    getTimeDiffNow: (time) => {
        time = time || moment().format().toString();
        var tar = moment(time);
        var diff = parseInt(tar.diff(moment().format(), 's'));
        return diff;
    },

    getVeryCode: () => {
        return Math.ceil(Math.random() * (1000000 - 100000) + 100000);
    }

};

module.exports = utils;
