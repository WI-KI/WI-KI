var express = require('express');
var router = express.Router();
var fs = require('fs'); 
var dbHandel = require('../utils/db');
var jwt = require("../utils/token");
const { resolve } = require('path');

var hasPrivilegeArchives = (archives_id, username) => {
    return new Promise((resolve, reject) => {
        if (!username || !archives_id) return resolve(false);
        dbHandel.exec({
            sql: `
            SELECT archives_id
            FROM archives
            WHERE (username = ?
            OR team_id IN (
                SELECT team_id FROM
                user_team
                WHERE username = ?
            )
            OR team_id IN (
                SELECT team_id FROM
                team
                WHERE username = ?
            ))
            AND archives_id = ?
            `,
            params: [username, username, username, archives_id],
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

var hasPrivilegeArticle = (article_id, username) => {
    return new Promise((resolve, reject) => {
        if (!username || !article_id) return resolve(false);
        dbHandel.exec({
            sql: `
			SELECT article_id
			FROM article
            WHERE (username = ?
            OR team_id IN (
                SELECT team_id FROM
                user_team
                WHERE username = ?
            )
            OR team_id IN (
                SELECT team_id FROM
                team
                WHERE username = ?
			))
            AND article_id = ?
            `,
            params: [username, username, username, article_id],
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

var hasPrivilegeMD = (md_id, username) => {
	return new Promise((resolve, reject) => {
		if (!md_id || !username) return resolve(false);
		dbHandel.exec({
			sql: `
			SELECT md_id 
			FROM article_md
			LEFT JOIN article
			ON article_md.article_id = article.article_id
			WHERE md_id = ?
			AND (article.username = ?
			OR team_id IN (
                SELECT team_id FROM
                user_team
                WHERE username = ?
            )
            OR team_id IN (
                SELECT team_id FROM
                team
                WHERE username = ?
			))
			`,
			params: [md_id, username, username, username],
			success: res => {
				if (res && res.length > 0) resolve(true);
				else resolve(false);
			},
			error: err => {
				if (err) console.log(err);
			}
		})
	})
}

var inTeam = (team_id, username) => {
	return new Promise((resolve, reject) => {
		dbHandel.exec({
			sql: `
			SELECT team_id
			FROM team
			WHERE team_id = ?
			AND 
			(username = ? 
			OR 
			team_id IN (
				SELECT team_id
				FROM user_team
				WHERE username = ?
			)
			OR
			team_id IN (
				SELECT team_id
				FROM team
				WHERE username = ?
			))
			`,
			params: [team_id, username, username, username],
			success: res => {
				if (res && res.length > 0) resolve(true);
				else resolve(false);
			},
			error: err => {
				if (err) console.log(err);
			}
		})
	})
}

router.get("/getAll", async (req, res, next) => {
	var username = req.user.username || "";

	var get = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				SELECT 
				article.article_id AS article_id,
				article.title AS title, 
				DATE_FORMAT(article.date, '%Y-%m-%d') AS date,
				article.archives_id AS archives_id,
				locked,
				article.team_id AS team_id,
				article.username AS username,
				team.team_name AS team_name,
				IFNULL(comment_num, 0) AS comment_num
				FROM article
				LEFT JOIN team
				ON article.team_id = team.team_id
				LEFT JOIN (
					SELECT 
					article_id,
					COUNT(*) AS comment_num
					FROM comment
					GROUP BY
					article_id
				) AS comment
				ON article.article_id = comment.article_id
				WHERE locked = 0 
				OR 
				article.username = ? 
				OR
				article.team_id IN (
					SELECT team_id FROM 
					team
					WHERE username = ?) 
				OR
				article.team_id IN (
					SELECT team_id FROM
					user_team
					WHERE username = ?)
				ORDER BY article_id DESC
				`,
				params: [username, username, username],
				success: res => {
					if (res) resolve(res);
					else resolve([]);
				},
				error: err => {
					if (err) console.log(err);
				}
			})
		})

	}

	let content = await get();
	res.json({
		status: "1",
		content: content,
	});

})

router.get("/getMy", jwt.auth, async (req, res, next) => {
	var username = req.user.username || "";

	var get = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
					SELECT 
					article.article_id AS article_id,
					article.title AS title, 
					DATE_FORMAT(article.date, '%Y-%m-%d') AS date,
					article.archives_id AS archives_id,
					locked,
					article.team_id AS team_id,
					article.username AS username,
					team.team_name AS team_name,
					IFNULL(comment_num, 0) AS comment_num
					FROM article
					LEFT JOIN team
					ON article.team_id = team.team_id
					LEFT JOIN (
						SELECT 
						article_id,
						COUNT(*) AS comment_num
						FROM comment
						GROUP BY
						article_id
					) AS comment
					ON article.article_id = comment.article_id
					WHERE 
					article.username = ? 
					OR
					article.team_id IN (
						SELECT team_id FROM 
						team
						WHERE username = ?) 
					OR
					article.team_id IN (
						SELECT team_id FROM
						user_team
						WHERE username = ?)
					ORDER BY article_id DESC
				`,
				params: [username, username, username],
				success: res => {
					if (res) resolve(res);
					else resolve([]);
				},
				error: err => {
					if (err) console.log(err);
				}
			})
		})
	}

	let content = await get();
	res.json({
		status: "1",
		content: content,
	});
})

router.get("/user/:username/getChild/:archives_id", async (req, res, next) => {
	var { username, archives_id } = req.params;
	var hasPrivilege = await hasPrivilegeArchives(archives_id, req.user.username || "");

	if (archives_id == "0" && username == req.user.username) hasPrivilege = true;

	var get = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				SELECT 
				article_id,
				title,
				DATE_FORMAT(date, '%Y-%m-%d') AS date,
				archives_id,
				locked
				FROM article			
				WHERE
				archives_id = ?
				AND username = ? 	
				AND (locked = 0 OR locked = ?)
				ORDER BY title
				`,
				params: [archives_id, username, hasPrivilege],
				success: res => {
					if (res) resolve(res);
					else resolve([]);
				},
				error : err => {
					if (err) {
						console.log(err);
					}
				}
			})
		})
	}

	var content = await get();
	res.json({
		status: "1",
		content: content,
	});
})

router.get("/team/:team_id/getChild/:archives_id", async (req, res, next) => {
	var { team_id, archives_id } = req.params;

	var hasPrivilege = await hasPrivilegeArchives(archives_id, req.user.username || "");

	if (archives_id == "0" && await inTeam(team_id, req.user.username || "")) {
		hasPrivilege = true;
	}

	var get = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				SELECT 
				article_id,
				title,
				DATE_FORMAT(date, '%Y-%m-%d') AS date,
				archives_id,
				locked
				FROM article			
				WHERE
				archives_id = ?
				AND team_id = ? 	
				AND (locked = 0 OR locked = ?)
				ORDER BY title
				`,
				params: [archives_id, team_id, hasPrivilege],
				success: res => {
					if (res) resolve(res);
					else resolve([]);
				},
				error : err => {
					if (err) {
						console.log(err);
					}
				}
			})
		})
	}

	var content = await get();
	res.json({
		status: "1",
		content: content,
	});	
})

router.get('/get/:article_id', async (req, res, next) => {
	var { article_id } = req.params;
	var username = req.user.username || "";
	var hasPrivilege = await hasPrivilegeArticle(article_id, username);
	
	var get = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				SELECT 
				article_id,
				markdown,
				html,
				title,
				DATE_FORMAT(date, '%Y-%m-%d') AS date,
				archives_id,
				locked,
				article.username,
				article.team_id,
				team.team_name
				FROM 
				article
				LEFT JOIN team
				ON article.team_id = team.team_id
				WHERE article_id = ?
				AND (locked = 0 OR locked = ?)
				`,
				params: [article_id, hasPrivilege],
				success: res => {
					if (res && res.length > 0) resolve(res[0]);
					else resolve(null);
				},
				error: err => {
					if (err) {
						console.log(err);
					}
				}
			});
		})

	}

	var content = await get();
	if (!content) return res.status(401).end();
	res.json({
		status: "1",
		content: content,
	});

});

router.post('/update', jwt.auth, async (req, res, next) => { 
	var username = req.user.username || "";
	var { article_id, title, markdown, html, archives_id, locked } = req.body;
	locked = parseInt(locked);

	if (!await hasPrivilegeArticle(article_id, username)) {
		return res.status(401).end();
	}

	if (locked < 0 || locked > 1) {
		return res.json({
			status: "0",
			message: "参数不正确！",
		});
	}

	var getArticle = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `SELECT username, team_id, markdown FROM article WHERE article_id = ?`,
				params: [article_id],
				success: res => {
					if (res && res.length > 0) resolve(res[0]);
					else resolve({});
				},
				error: err => {
					if (err) console.log(err);
				}
			})
		})
	}

	var sqlParamsEntity = [];
	var oldArticle = await getArticle();
	
	if (archives_id != "0") {
		var validArchivesID = () => {
			return new Promise((resolve, reject) => {
				dbHandel.exec({
					sql: `
					SELECT archives_id
					FROM archives
					WHERE (username = ?
					OR team_id = ?)
					AND archives_id = ?
					`,
					params: [oldArticle.username, oldArticle.team_id, archives_id],
					success: res => {
						if (res && res.length > 0) resolve(true);
						else resolve(false);
					},
					error: err => {
						if (err) console.log(err);
					}
				})
			})
		}
		var ok = await validArchivesID();
		if (!ok) {
			return res.json({
				status: "0",
				message: "父档案编号不合法",
			});
		}
	}
	
	if (markdown != oldArticle.markdown) {
		sqlParamsEntity.push(dbHandel._getNewSqlParamEntity(`
		INSERT INTO article_md
		(article_id, markdown, date, username)
		VALUES(?, ?, NOW(), ?);	
		`,[article_id, markdown, username]));
	}

	sqlParamsEntity.push(dbHandel._getNewSqlParamEntity(`
	UPDATE article
	SET title = ?,
	markdown = ?,
	html = ?,
	archives_id = ?,
	locked = ?
	WHERE article_id = ?
	`, [title, markdown, html, archives_id, locked, article_id]));

	var update = () => {
		return new Promise((resolve, reject) => {
			dbHandel.execTrans(sqlParamsEntity, (err, info) => {
				if (err) resolve(false);
				else resolve(true);
			});		
		})
	}

	res.json({
		status: await update() ? "1" : "0",
	});

});

router.post('/add/user/:username', jwt.auth, async (req, res, next) => {
	var { title, archives_id } = req.body; 
	var username = req.params.username;

	if (username != req.user.username || (archives_id != "0" && ! await hasPrivilegeArchives(archives_id, username))) {
		return res.status(401).end();
	}

	var add = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				INSERT INTO article
				(markdown, html, title, date, archives_id, username)
				VALUES 
				(?, ?, ?, NOW(), ?, ?)
				`,
				params: ["", "", title, archives_id, username],
				success: res => {
					if (res) resolve(true);
					else resolve(false);
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
		status: await add() ? "1" : "0",
	});

});

router.post('/add/team/:team_id', jwt.auth, async (req, res, next) => {
	var { title, archives_id } = req.body; 
	var team_id = req.params.team_id;
	var username = req.user.username || "";

	if (!await inTeam(team_id, username) || (archives_id != "0" && !await hasPrivilegeArchives(archives_id, username))) {
		return res.status(401).end();
	}

	var add = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				INSERT INTO article
				(markdown, html, title, date, archives_id, team_id)
				VALUES 
				(?, ?, ?, NOW(), ?, ?)
				`,
				params: ["", "", title, archives_id, team_id],
				success: res => {
					if (res) resolve(true);
					else resolve(false);
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
		status: await add() ? "1" : "0",
	});

});

router.get('/history/list/:article_id', jwt.auth, async (req, res, next) => {
	var username = req.user.username || "";
	var article_id = req.params.article_id;
	if (!await hasPrivilegeArticle(article_id, username)) {
		return res.status(401).end();
	}
	
	var get = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				SELECT 
				md_id, 
				article_id,
				markdown,
				DATE_FORMAT(date, '%Y-%m-%d %H:%i:%S') AS date, 
				username 
				FROM article_md 
				WHERE article_id = ?
				ORDER BY md_id DESC
				`,
				params: [article_id],
				success: res => {
					if (res) resolve(res);
					else resolve([]);
				},
				error: err => {
					if (err) {
						console.log(err);
					}
				}
			});	
		})

	}

	var content = await get();
	res.json({
		status: "1",
		content: content,
	});

});

router.post("/history/source", jwt.auth, async (req, res, next) => {
	var username = req.user.username || "";
	var { article_id, md_id } = req.body;

	if (!await hasPrivilegeArticle(article_id, username)) {
		return res.status(401).end();
	}
	
	var get = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({
				sql: `
				SELECT 
				md_id, 
				article.article_id AS article_id,
				article.title AS title,
				article_md.markdown AS markdown,
				DATE_FORMAT(article_md.date, '%Y-%m-%d %H:%i:%S') AS date, 
				article_md.username 
				FROM article_md 
				LEFT JOIN article
				ON article_md.article_id = article.article_id
				WHERE md_id = ?
				AND article_md.article_id = ?
				`,
				params: [md_id, article_id],
				success: res => {
					if (res && res.length > 0) resolve(res[0]);
					else resolve({});
				},
				error: err => {
					if (err) {
						console.log(err);
					}
				}
			});	
		})

	}

	var content = await get();
	res.json({
		status: "1",
		content: content,
	});
})

router.post('/history/compare', jwt.auth, async (req, res, next) => {
	var { article_id, md_id1, md_id2 } = req.body;
	var username = req.user.username || "";

	if (!await hasPrivilegeArticle(article_id, username)) {
		return res.status(401).end();
	}	

	var get = () => {
		return new Promise((resolve, reject) => {
			dbHandel.exec({ 
				sql: `
				SELECT 
				md_id,
				article_md.article_id,
				DATE_FORMAT(article_md.date, '%Y-%m-%d %H:%i:%S') AS date, 
				article_md.markdown,
				title,
				article_md.username
				FROM
				article_md
				LEFT JOIN article
				ON article.article_id = article_md.article_id
				WHERE article.article_id = ? AND (md_id = ? OR md_id = ?)
				`,
				params: [article_id, md_id1, md_id2],
				success: res => {
					let content = {};
					if (res && res.length == 2) {
						res.map(item => {
							content[item.md_id] = item;
						})
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

module.exports = router;