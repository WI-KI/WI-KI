var express = require('express');
var router = express.Router();
var dbHandel = require('../utils/db');
var jwt = require("../utils/token"); 

var hasPrivilege = (archives_id, username) => {
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

var userInTeam = (username, team_id) => {
    return new Promise((resolve, reject) => {
        if (!username || !team_id) return resolve(false);
        dbHandel.exec({
            sql: `
            SELECT team_id
            FROM team
            WHERE (username = ?)
            OR (team_id IN (SELECT team_id FROM user_team WHERE username = ?))
            `,
            params: [username, username],
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

var userExist = (username) => {
    return new Promise((resolve, reject) => {
        dbHandel.exec({
            sql: `SELECT username FROM user WHERE username = ?`,
            params: [username],
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

var getTeam = (team_id) => {
    return new Promise((resolve, reject) => {
        dbHandel.exec({
            sql: `SELECT * FROM team WHERE team_id = ?`,
            params: [team_id],
            success: res => {
                if (res && res.length > 0) resolve(res[0]);
                else resolve(null);
            },
            error: err => {
                if (err) console.log(err);
            }
        })
    })    
}

var archivesExist = (archives_id) => {
    return new Promise((resolve, reject) => {
        if (archives_id == "0") return resolve(true);
        dbHandel.exec({
            sql: `SELECT archives_id FROM archives WHERE archives_id = ?`,
            params: [archives_id],
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
    
    var get = async () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                SELECT 
                archives_id,
                fa_id,
                title,
                archives.username,
                archives.team_id,
                team.team_name
                FROM 
                archives
                LEFT JOIN team
                ON archives.team_id = team.team_id
                ORDER BY archives_id DESC
                `,
                params: [],
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

    let content = await get();
    res.json({
        status: '1',
        content: content,
    });
})

router.get("/user/:username/getChild/:archives_id", async (req, res, next) => {
    var { username, archives_id } = req.params;
    
    if (!await userExist(username) || !await archivesExist(archives_id)) {
        return res.status(404).end();
    }

    var get = () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                SELECT 
                archives_id,
                fa_id,
                title,
                archives.username,
                archives.team_id,
                team.team_name
                FROM 
                archives
                LEFT JOIN team
                ON archives.team_id = team.team_id
                WHERE archives.username = ?
                AND fa_id = ?
                `,
                params: [username, archives_id],
                success: res => {
                    if (res) resolve(res);
                    else resolve([]);
                },
                error: err => {
                    if (err) {
                        console.log(err);
                    }
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

router.get("/team/:team_id/getChild/:archives_id", async (req, res, next) => {
    var { team_id, archives_id } = req.params;

    var teamInfo = await getTeam(team_id);

    if (!teamInfo || !await archivesExist(archives_id)) {
        return res.status(404).end();
    }

    var get = () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                SELECT 
                archives_id,
                fa_id,
                title,
                archives.username AS username,
                archives.team_id AS team_id,
                team.team_name AS team_name
                FROM 
                archives
                LEFT JOIN team
                ON archives.team_id = team.team_id
                WHERE archives.team_id = ?
                AND fa_id = ?
                `,
                params: [team_id, archives_id],
                success: res => {
                    if (res) resolve(res);
                    else resolve([]);
                },
                error: err => {
                    if (err) {
                        console.log(err);
                    }
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

router.get('/user/:username/getParent/:archives_id', async (req, res, next) => {
    var { username, archives_id } = req.params;

    if (!await userExist(username) || !await archivesExist(archives_id)) {
        return res.status(404).end();
    }
    
    var get = () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                SELECT
                archives_id,
                title,
                fa_id
                FROM archives
                WHERE username = ? 
                `,
                params: [username],
                success: res => {
                    if (res) {
                        var archives = {};
                        for (var i = 0; i < res.length; ++i) {
                            archives[res[i].archives_id] = res[i];
                        }
                        var parent = [];
                        var dfs = u => {
                            parent.push(archives[u]);
                            if (archives[u].fa_id == '0') {
                                return;
                            }
                            dfs(archives[u].fa_id);
                        }
                        if (archives[archives_id]) dfs(archives_id);
                        parent.push({archives_id:"0", title: username, fa_id: "-1"});
                        parent.reverse();
                        resolve(parent);
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

    let content = await get();
    res.json({
        status: "1",
        content: content,
    });

})

router.get('/team/:team_id/getParent/:archives_id', async (req, res, next) => {
    var { team_id, archives_id } = req.params;
    var teamInfo = await getTeam(team_id);

    if (!teamInfo || !await archivesExist(archives_id)) {
        return res.status(404).end();
    }
    
    var get = () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                SELECT
                archives_id,
                title,
                fa_id
                FROM archives
                WHERE team_id = ?
                `,
                params: [team_id],
                success: res => {
                    if (res) {
                        var archives = {};
                        for (var i = 0; i < res.length; ++i) {
                            archives[res[i].archives_id] = res[i];
                        }
                        var parent = [];
                        var dfs = u => {
                            parent.push(archives[u]);
                            if (archives[u].fa_id == '0') {
                                return;
                            }
                            dfs(archives[u].fa_id);
                        }
                        if (archives[archives_id]) dfs(archives_id);
                        parent.push({archives_id: "0", title: teamInfo.team_name + "(#" + teamInfo.team_id + ")", fa_id: "-1"});
                        parent.reverse();
                        resolve(parent);
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

    let content = await get();
    res.json({
        status: "1",
        content: content,
    });

})

router.get("/getMy", jwt.auth, async (req, res, next) => {
    var username = req.user.username || "";
    var get = async () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                SELECT 
                archives_id,
                fa_id,
                title,
                archives.username,
                archives.team_id,
                team.team_name
                FROM 
                archives
                LEFT JOIN team
                ON archives.team_id = team.team_id
                WHERE archives.username = ?
                OR archives.team_id IN (
                    SELECT team_id 
                    FROM team
                    WHERE username = ?
                )
                OR archives.team_id IN (
                    SELECT team_id
                    FROM user_team
                    WHERE username = ?
                )
                ORDER BY title
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

router.post('/add', jwt.auth, async (req, res, next) => {
    var { title, fa_id, username, team_id } = req.body;

    if (username) {
        if (username != req.user.username) {
            return res.status(401).end();
        }
    }

    if (team_id) {
        if (! await userInTeam(req.user.username || "", team_id)) {
            return res.status(401).end();
        }
    }

    var validFaID = () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                SELECT archives_id
                FROM archives
                WHERE (username = ?
                OR team_id = ?)
                AND archives_id = ?
                `,
                params: [username, team_id, fa_id],
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

    if (fa_id != "0") {
        var ok = await validFaID();
        if (!ok) {
            return res.json({
                status: "0",
                message: "父档案编号不合法",
            });
        }
    }

    var add = () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                INSERT INTO archives
                (title, fa_id, username, team_id)
                VALUES
                (?, ?, ?, ?)
                `,
                params: [title, fa_id, username, team_id],
                success: res => {
                    if (res) resolve(true);
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

    if (await add()) {
        res.json({
            status: "1",
            message: "添加成功！",
        });
    } else {
        res.json({
            status: "0",
            message: "添加失败！",
        })
    }

});

router.post('/update', jwt.auth, async (req, res, next) => {
    var { title, fa_id, archives_id } = req.body;
    var username = req.user.username;

    if (! await hasPrivilege(archives_id, username)) {
        return res.status(401).end();
    }

    var validFaID = () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                SELECT archives_id
                FROM archives
                WHERE (username = (
                    SELECT username
                    FROM archives
                    WHERE archives_id = ?
                )
                OR team_id = (
                    SELECT team_id
                    FROM archives
                    WHERE archives_id = ?
                ))
                AND archives_id = ?
                `,
                params: [archives_id, archives_id, fa_id],
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

    if (fa_id != "0") {
        var ok = await validFaID();
		if (!ok) {
			return res.json({
				status: "0",
				message: "父档案编号不合法",
			});
		}
	}

   
    var update = () => {
        return new Promise((resolve, reject) => {
            dbHandel.exec({
                sql: `
                UPDATE archives
                SET 
                title = ?,
                fa_id = ?
                WHERE archives_id = ?
                `,
                params: [title, fa_id, archives_id],
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

    if (await update()) {
        res.json({
            status: "1",
            message: "更新成功！",
        })
    } else {
        res.json({
            status: "0",
            message: "更新失败！",
        })
    }
});

module.exports = router;
