var express = require('express');
var router = express.Router();
var fs = require('fs'); 
var dbHandel = require('../utils/db');
var gravatar = require('gravatar');
var utils = require('../utils/utils');
var redis = require('../utils/redis');
var moment = require('moment');
var CONFIG = require('../../config-server');
var jwt = require("../utils/token");

var getComment = (comment_id) => {
    return new Promise((resolve, reject) => { 
        dbHandel.exec({ 
            sql: `SELECT
            comment_id,
            article_id,
            comment.username AS username,
            user.email AS email
            FROM comment
            LEFT JOIN user
            ON comment.username = user.username
            WHERE comment_id = ?
            `,
            params: [comment_id],
            success: res => {
                if (res && res.length > 0) resolve(res[0]);
                else resolve({});
            },
            error: err => {
                if (err) {
                    console.log(err);
                }
            }
        })        
    })
}

var getUrl = (article_id) => {
    return new Promise((resolve, reject) => { 
        dbHandel.exec({ 
            sql: `SELECT
            username,
            team_id
            FROM article
            WHERE article_id = ?
            `,
            params: [article_id],
            success: res => {
                if (res && res.length > 0) {
                    var { username, team_id } = res[0];
                    if (username) resolve([CONFIG.host, "user", username, "article", "details", article_id].join("/"));
                    else if (team_id) resolve([CONFIG.host, "team", team_id, "article", "details", article_id].join("/"));
                } else resolve("");
            },
            error: err => {
                if (err) {
                    console.log(err);
                }
            }
        })        
    })    
}

router.get('/get/:article_id', async (req, res, next) => {
    var article_id = req.params.article_id; 
    
    var get = () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                SELECT 
                comment_id,
                fa_id,
                html,
                article_id,
                DATE_FORMAT(date, '%Y-%m-%d %H:%i:%S') AS date,
                comment.username AS username,
                user.email AS email
                FROM comment
                LEFT JOIN user
                ON comment.username = user.username
                WHERE article_id = ?
                ORDER BY date
                `,
                params: [article_id],
                success: res => {
                    var content = {};
                    if (res && res.length > 0) {
                        for (var i = 0; i < res.length; ++i) {
                            var item = res[i];
                            item.imgUrl = utils.gravatar(item.email);
                            delete item.email;
                            content[item.comment_id] = item;
                        }
                    }
                    resolve(content);
                },
                error: err => {
                    if (err) {
                        console.log(err);
                    }
                }
            });
        })
    }

    res.json({
        status: "1",
        content: await get(),
    });


});

router.post('/add', jwt.auth, async (req, res, next) => {
    var { article_id, fa_id, markdown, html } = req.body;
    var username = req.user.username || "";

    var getEmailText = (to, from, url) => {
        var text =  "Hello, " + to + ".\n\n" +
                    "User " + from + " sent you a reply，Click " + url + " to view it." + "\n\n" +
                    "The " + CONFIG.title + " Team.\n";
        return text;
    }

    var addComment = async () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                INSERT INTO
                comment
                (fa_id, markdown, html, article_id, date, username)
                VALUES (
                    ?, ?, ?, ?, NOW(), ?
                )
                `,
                params: [fa_id, markdown, html, article_id, username],
                success: res => {
                    if (res) {
                        resolve(res.insertId.toString());
                    } else {
                        resolve("-1");
                    }
                },
                error: err => {
                    if (err) {
                        console.log(err);
                    }
                }
            });
        })
    };

    // if (CONFIG.comment.wait) {
    //     var key = ["comment", "time", utils.getIP(req)].join("-");
    //     var value = await redis.get(key);
    //     var diff = utils.getTimeDiffNow(value);
    //     if (diff > 0) {
    //         return res.json({
    //             status: '0',
    //             message: '您还需等待' + diff + "秒才能发送下一条评论"            
    //         })
    //     } 
    //     await redis.set(key, moment().add(CONFIG.comment.waitTime, 's').toString(), parseInt(CONFIG.comment.waitTime));
    // }

    console.log(fa_id);
    if (fa_id != "0") {
        var fa_comment = await getComment(fa_id);
        if (fa_comment.article_id != article_id) {
            return res.json({
                status: "0",
                message: "评论失败！",
            });
        }
    }
    var insertId = await addComment();

    if (insertId == "-1") {
        return res.json({
            status: "0",
            message: "评论失败！",
        })
    } else {
        res.json({
            status: "1",
            message: "评论成功！",
        });
        if (CONFIG.comment.emailHint && fa_id != "0") {
            utils.sendEmail(fa_comment.email, CONFIG.comment.emailSubject, getEmailText(fa_comment.username, username, await getUrl(article_id) + "#comment-" + insertId));
        }

    }
});

module.exports = router;