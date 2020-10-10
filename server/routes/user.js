var express = require('express');
var router = express.Router();
var dbHandel = require('../utils/db');
var CONFIG = require("../../config-server");
var utils = require("../utils/utils");
var moment = require('moment');
var redis = require("../utils/redis");
var jwt = require("../utils/token");

router.post("/login", async (req, res) =>  {
	var _res = res;
	var { username, password } = req.body;
	password = utils.md5(password);
	var ip = utils.getIP(req);
	var waitKey = [CONFIG.redis.prefix, "login", "time", username, ip].join("-")

	var afterWork = async () => {
		await redis.set(waitKey, moment().add(CONFIG.login.waitTime, 's').toString(), CONFIG.login.waitTime);
		return _res.json({
			status: '0',
			message: "账号或密码错误!",
		});
	}

	var gao = () => {
		dbHandel.exec({
			sql: `
			SELECT * 
			FROM user
			WHERE
			username = ?
			AND password = ?
			`,
			params: [username, password],
			success: async res => {
				if (res && res.length > 0) {
					var newToken = await jwt.signToken(utils.getUser(res[0]));
					_res.setHeader("token", newToken);
					_res.json({
						status: '1',
					});
				} else {
					afterWork();
				}
			},
			error: err => {
				if (err) {
					console.log(err);
					_res.status(500).end();
				}
			}
		});
	};

	if (CONFIG.login.wait) {
		var time = await redis.get(waitKey);
		var diff = utils.getTimeDiffNow(time);
		if (diff > 0) {
			return _res.json({
				status: '0',
				message: '您还需等待' + diff + "秒才能进行下一次登录尝试"
			});
		} else {
			gao();
		}
	} else {
		gao();
	}
})

router.post("/email/verycode", async (req, res, next) => {
	var _res = res;
	var { email } = req.body;
	var ip = utils.getIP(req);
	var waitKey = [CONFIG.redis.prefix, "email", "time", email, ip].join("-");

	if (!utils.ismail(email)) {
		return _res.json({
			status: '0',
			message: "请输入正确的邮箱",
		});
	}

	var getEmailText = verycode => {
		var text = "Your Verification Code is " + verycode + ".\n\n" +
					"The Verification Code is valid for " + CONFIG.register.validTime + " minutes.\n\n" +
					"The " + CONFIG.title + " Team.\n";
		return text;
	}

	var gao = async () => {
		var verycode = utils.getVeryCode();
		var key = [CONFIG.redis.prefix, "email", "verycode", email].join("-");
		var value = verycode;
		await redis.set(key, verycode, parseInt(CONFIG.register.validTime) * 60);
		await redis.set(waitKey, moment().add(CONFIG.register.waitTime, 's').toString(), CONFIG.register.waitTime);
		await utils.sendEmail(email, CONFIG.register.emailSubject, getEmailText(verycode));
		_res.json({
			status: '1',
			message: "验证码发送成功！",
		});
	}

	if (CONFIG.register.wait) {
		var time = await redis.get(waitKey);
		var diff = utils.getTimeDiffNow(time);
		if (diff > 0) {
			_res.json({
				status: '0',
				message: '您还需等待' + diff + "秒才能发送验证码",
			});
		} else {
			gao();
		}	
	} else {
		gao();
	}
})

router.post("/register", async (req, res, next) => {
	var _res = res;
	var { email, username, password, rptpassword, verycode } = req.body;

	if (!utils.validUsername(username)) {
		return _res.json({
			status: '0',
			message: "用户名不合法，应为4-12位的数字、字母或下划线",
		});
	}
	if (!utils.validPassword(password)) {
		return _res.json({
			status: '0',
			message: "密码不合法，应为4-20位的数字、字母或下划线",
		});
	}
	if (password != rptpassword) {
		return _res.json({
			status: '0',
			message: "两次密码输入不一致",
		});
	}

	password = utils.md5(password);

	var key = [CONFIG.redis.prefix, "email", "verycode", email].join("-");
	var register = async () => {
		dbHandel.exec({
			sql: `
			INSERT INTO user
			(username, password, email, datetime)
			VALUES (
				?, ?, ?, NOW()
			)
			`,
			params: [username, password, email],
			success: async res => {
				if (res) {
					await redis.del(key);
					_res.json({
						status: '1',
						message: "注册成功",
					});
				}
			},
			error: err => {
				if (err) {
					console.log(err);
					_res.status(500).end();
				}
			}
		});
	}

	var targetVeryCode = await redis.get(key);
	if (targetVeryCode == verycode) {
		dbHandel.exec({
			sql: `
			SELECT *
			FROM user
			WHERE 
			email = ?
			OR 
			username = ?
			`,
			params: [email, username],
			success: res => {
				if (res && res.length > 0) {
					for (var i = 0; i < res.length; ++i) {
						if (email == res[i].email) {
							return _res.json({
								status: '0',
								message: "该邮箱已注册",
							});
						} 
						if (username == res[i].username) {
							return _res.json({
								status: '0',
								message: "该用户名已注册",
							});
						}
					}
					register();
				} else {
					register();
				}
			},
			error: err => {
				if (err) {
					_res.json({
						status: '0',
						message: "注册失败, 请重试!",
					});
				}
			}
		});
	} else {
		return _res.json({
			status: '0',
			message: "验证码不正确或已过期",
		});
	}
})

router.post("/resetPassword", async (req, res, next) => {
	var _res = res;
	var { email, verycode, password, rptpassword } = req.body;

	if (!utils.validPassword(password)) {
		return _res.json({
			status: '0',
			message: "密码不合法，应为4-20位的数字、字母或下划线",
		});
	}
	if (password != rptpassword) {
		return _res.json({
			status: '0',
			message: "两次密码输入不一致",
		});
	}

	password = utils.md5(password);

	var key = [CONFIG.redis.prefix, "email", "verycode", email].join("-");
	var reset = async (username) => {
		dbHandel.exec({
			sql: `
			UPDATE user
			SET password = ?
			WHERE email = ?
			`,
			params: [password, email],
			success: async (res) => {
				if (res) {
					await redis.del(key);
					_res.json({
						status: '1',
						username: username,
						message: "重置成功",
					});
				}
			},
			error: err => {
				if (err) {
					console.log(err);
					_res.status(500).end();
				}
			}
		});
	}

	var targetVeryCode = await redis.get(key);
	if (targetVeryCode == verycode) {
		dbHandel.exec({
			sql: `
			SELECT *
			FROM user
			WHERE 
			email = ?
			`,
			params: [email],
			success: res => {
				if (res && res.length > 0) {
					reset(res[0].username);
				} else {
					if (res.length == 0) {
						_res.json({
							status: '0',
							message: "该邮箱未注册账号!",
						})
					}
				}
			},
			error: err => {
				if (err) {
					console.log(err);
					_res.status(500).end();
				}
			}
		});
	} else {
		return _res.json({
			status: '0',
			message: "验证码不正确或已过期",
		});
	}	

})

router.get("/getAll", function(req, res, next) {
	var _res = res;
	dbHandel.exec({
		sql: `
		SELECT *
		FROM user
		ORDER BY datetime DESC
		`,
		params: [],
		success: res => {
			if (res) {
				res.map(item => {
					item.imgUrl = utils.gravatar(item.email);
				});
				_res.json({
					status: '1',
					content: res
				});
			}
		},
		error: err => {
			if (err) {
				console.log(err);
				_res.status(500).end();
			}
		}
	})
})

router.get("/currentUser", function (req, res, next) {
	var token = req.token;
	if (!token) {
		res.json({ status: '0'});
	} else {
		res.json({
			status: '1',
			user: req.user,
		});
	}
})

router.post("/update", jwt.auth, function (req, res, next) {
	var _res = res;
	var token = req.token;
	var user = req.user;
	var { email, username, password, school, name } = req.body;

	if (username != user.username) {
		return _res.json({
			status: '0',
			message: "无效的token",
		});
	}

	if (utils.md5(password) != user.password) {
		return _res.json({
			status: '0',
			message: "密码错误!",
		});
	}

	dbHandel.exec({
		sql: `
		UPDATE user
		SET school = ?,
		name = ?
		WHERE username = ?
		AND email = ?
		`,
		params: [school, name, username, email],
		success: async res => {
			if (res) {
				user.name = name;
				user.school = school;
				var newToken = await jwt.signToken(utils.getUser(user));
				_res.setHeader("token", newToken);
				_res.json({
					status: '1',
					message: "个人信息修改成功",
				});
				jwt.delToken(token);
			}
		},
		error: err => {
			if (err) {
				console.log(err);
				_res.status(500).end();
			}
		}
	})
})

router.post("/changePassword", jwt.auth, function (req, res, next) {
	var _res = res;
	var token = req.token;
	var user = req.user;
	var { password, newPassword, rptPassword } = req.body;

	if (!utils.validPassword(newPassword)) {
		return _res.json({
			status: '0',
			message: "新密码不合法，应为4-20位的数字、字母或下划线",
		});
	}

	if (newPassword != rptPassword) {
		return _res.json({
			status: '0',
			message: "两次密码输入不一致",
		});
	}

	password = utils.md5(password);
	newPassword = utils.md5(newPassword);
	if (password != user.password) {
		return _res.json({
			status: '0',
			message: "旧密码错误!",
		});
	}

	dbHandel.exec({
		sql: `
		UPDATE user
		SET password = ?
		WHERE email = ?
		`,
		params: [newPassword, user.email],
		success: async res => {
			if (res) {
				await jwt.delToken(token);
				user.password = newPassword;
				var newToken = await jwt.signToken(utils.getUser(user));
				_res.setHeader("token", newToken);
				_res.json({
					status: '1',
					message: "新密码修改成功",
				});	
			}
		},
		error: err => {
			if (err) {
				console.log(err);
				_res.status(500).end();
			}
		}
	})
})

router.get("/logout", jwt.auth, async (req, res, next) => {
	await jwt.delToken(req.token);
	res.status(200).end();
})

module.exports = router;