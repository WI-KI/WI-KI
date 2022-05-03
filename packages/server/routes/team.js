var express = require('express');
var router = express.Router();
var dbHandel = require('../utils/db');
var CONFIG = require("../../config-server");
var utils = require("../utils/utils");
var jwt = require("../utils/token");
const db = require('../utils/db');

var isCreator = (team_id, username) => {
	return new Promise((resolve, reject) => {
		dbHandel.exec({
			sql: `
			SELECT * FROM
			team
			WHERE team_id = ?
			AND username = ?
			`,
			params: [team_id, username],
			success: res => {
				if (res && res.length > 0) resolve(true);
				else resolve(false);
			},
			error: err => {
				if (err) {
					console.log(err);
					resolve(false);
				}
			}
		})
	})	
}

var teamExist = (team_id) => {
	return new Promise((resolve, reject) => {
		dbHandel.exec({
			sql: `
			SELECT * FROM
			team
			WHERE team_id = ?
			`,
			params: [team_id],
			success: res => {
				if (res && res.length > 0) resolve(true);
				else resolve(false);
			},
			error: err => {
				if (err) {
					console.log(err);
				}
			}
		})
	})	
}

router.get("/getAll", function(req, res, next) {
	var _res = res;
	var username = req.user.username || ""; 
	dbHandel.exec({
		sql: `
		SELECT *
		FROM team
		ORDER BY team_id DESC
		`,
		params: [username],
		success: res => {
			if (res) {
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

router.get("/getMy", jwt.auth, function(req, res, next) {
	var _res = res;
	var username = req.user.username || "";
	dbHandel.exec({
		sql: `
		SELECT *
		FROM team
		WHERE 
		username = ?
		OR team_id IN (
			SELECT team_id
			FROM user_team
			WHERE username = ?
		)
		ORDER BY team_id
		`,
		params: [username, username],
		success: res => {
			if (res) {
				res.map(item => {
					item.hasPrivilege = username == item.username;
				})
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

router.post("/add", jwt.auth, async (req, res, next) => {
	var _res = res;
	var username = req.user.username || "";
	var { team_name } = req.body;
	dbHandel.exec({
		sql: `
		INSERT INTO 
		team
		(team_name, datetime, username)
		VALUES(
			?, NOW(), ?
		)
		`,
		params: [team_name, username],
		success: res => {
			if (res) {
				_res.json({
					status: '1',
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

router.post("/update", jwt.auth, async (req, res, next) => {
	var _res = res;
	var username = req.user.username || "";
	var { team_id, team_name } = req.body;

	if (!await isCreator(team_id, username)) {
		return res.status(401).end();
	}

	dbHandel.exec({
		sql: `
		UPDATE team
		SET team_name = ?
		WHERE username = ?
		AND team_id = ?
		`,
		params: [team_name, username, team_id],
		success: res => {
			if (res) {
				_res.json({
					status: '1',
					message: "修改成功！",
				});
			} else {
				_res.json({
					status: '0',
					message: "修改失败！",
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
})

router.get("/getSingle/:team_id", jwt.auth, async (req, res, next) => {
	var _res = res;
	var username = req.user.username || "";
	var team_id = req.params.team_id;
	
	var getInfo = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql:`SELECT * FROM team WHERE team_id = ? AND username = ?`,
				params: [team_id, username],
				success: res => {
					if (res && res.length > 0) resolve(res[0]);
					else resolve(null);
				},
				error: err => {
					if (err) {
						console.log(err);
						resolve(null);
					}
				}
			})
		})
	};

	var getTeamMember = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				SELECT * FROM user_team 
				LEFT JOIN user 
				ON user.username = user_team.username
				WHERE team_id = ?
				ORDER BY user.username
				`,
				params: [team_id],
				success: res => {
					if (res) {
						let item = res;
						item.map(item => {
							item.imgUrl = utils.gravatar(item.email);
						})
						resolve(item);
					} else {
						resolve([]);
					}
				},
				error: err => {
					if (err) {
						console.log(err);
					}
				}
			})
		})
	}

	let Info = await getInfo();

	if (!Info) {
		res.status(404).end();
		return;
	}

	let teamMember = await getTeamMember();
	res.json({
		status: '1',
		info: Info,
		teamMember: teamMember,
	});
})

router.post("/join", jwt.auth, async (req, res, next) => {
	var username = req.user.username || "";
	var team_id = req.body.team_id;
	
	var exist = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				SELECT *
				FROM user_team
				WHERE team_id = ?
				AND username = ?
				`,
				params: [team_id, username],
				success: res => {
					if (res && res.length > 0) {
						resolve(res[0].status);
					} else {
						resolve(null);
					}
				},
				error: err => {
					if (err) {
						console.log(err);
					}
				}
			})
		})
	}

	var add = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				INSERT INTO
				user_team
				(team_id, username, status)
				VALUES (?, ?, 0)
				`,
				params: [team_id, username],
				success: res => {
					if (res) {
						resolve(res);
					} else {
						resolve(null);
					}
				},
				error: err => {
					if (err) {
						console.log(err);
					}
				}
			})
		})
	}

	if (!await teamExist(team_id)) {
		return res.json({
			status: '0',
			message: "该队伍不存在!",
		});
	}

	if (await isCreator(team_id, username)) {
		return res.json({
			status: '0',
			message: "您是该队伍的创建者！",
		});
	}

	let status = await exist();
	if (status == "0") {
		res.json({
			status: '0',
			message: "您已经发送过申请，请等待回复！",
		});
	} else if (status == "1") {
		res.json({
			status: '0',
			message: "您已经加入该队伍！",
		});
	} else {
		let ok = await add();
		if (ok) res.json({ status: '1', message: "发送申请成功!" });
		else res.json({ status: '0', message: "发送申请失败，请重试！"});
	}
})

router.post("/changeTeamMemberStatus", jwt.auth, async (req, res, next) => {
	var { team_id, status, username } = req.body;
	var createorUsername = req.user.username || "";	 

	var gao = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				UPDATE user_team
				SET status = ?
				WHERE team_id = ?
				AND username = ?
				`,
				params: [status, team_id, username],
				success: res => {
					if (res) resolve(true);
					else resolve(false);
				},
				error : err => {
					if (err) {
						console.log(err);
						resolve(false);
					}
				}
			})
		})
	}

	if (await isCreator(team_id, createorUsername)) {
		if (await gao()) {
			res.json({ status: '1', message: "操作成功!"});
		} else {
			res.json({ status: '1', message: "操作失败，请重试！"});
		}
	} else {
		res.json({ status: '0', message: "权限不足！"});
	}
})

router.post("/delTeamMember", jwt.auth, async (req, res, next) => {
	var { team_id, username } = req.body;
	var createorUsername = req.user.username || "";
	
	if (! await isCreator(team_id, createorUsername)) {
		return res.status(401).end();
	}

	var gao = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `DELETE FROM user_team WHERE team_id = ? AND username = ?`,
				params: [team_id, username],
				success: res => {
					if (res) resolve(true);
				},
				error: err => {
					if (err) {
						console.log(err);
						resolve(false);
					}
				}
			})
		})
	}

	if (await gao()) {
		res.json({
			status: '1',
			message: "操作成功！",
		}) 
	} else {
		res.json({
			status: '0',
			message: "操作失败！",
		})
	}
})


module.exports = router;
