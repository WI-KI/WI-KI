var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({dest: 'upload_tmp/'});
var uuid = require('uuid');
var CONFIG = require('../../config-server');
var imagemin = require('imagemin');
var imageminJpegtran = require('imagemin-jpegtran');
var imageminPngquant = require('imagemin-pngquant');
var imageminWebp = require('imagemin-webp');
var jwt = require("../utils/token");
var minio = require("../utils/minio");

// 写入文件 遇到目录没创建就创建 遇到文件已存在就覆盖
const writeFileRecursive = function(path, buffer, callback){
    let lastPath = path.substring(0, path.lastIndexOf("/"));
    fs.mkdir(lastPath, {recursive: true}, (err) => {
        if (err) return callback(err);
        fs.writeFile(path, buffer, function(err){
            if (err) return callback(err);
            return callback(null);
        });
    });
}

const getFileSize = (filename) => {
	return new Promise((resolve, reject) => {
		fs.stat(filename, (err, stats) => {
			if (err) console.log(err);
			resolve(stats.size);
		})
	})
}

// router.post('/getbase64', upload.any(), async (req, res, next) => {
// 	var fileName = req.files[0].originalname;
// 	var reg = new RegExp(" ", "g");
// 	fileName = fileName.replace(reg, '-');
// 	var dest_path = path.join(CONFIG.base64.dir);
// 	var dest_file = path.join(dest_path, fileName);
// 	var extname = path.extname(fileName).slice(1,);
// 	var _res = res;
// 	fs.readFile(req.files[0].path, function(err, data) {
// 		writeFileRecursive(dest_file, data, async function(err) {
// 			fs.unlink(req.files[0].path, function(err) {
// 				if (err) {
// 					console.log(err);
// 				}
// 			});
// 			await imagemin([dest_path + '/*.{jpg,png,webp}'], {
// 				destination: dest_path,
// 				plugins: [
// 					imageminJpegtran(),
// 					imageminPngquant({
// 						quality: [0.6, 0.8]
// 					})
// 				],
// 				use: [
// 					imageminWebp({quality: 50})
// 				]
// 			});

// 			// var fileSize = await getFileSize(dest_file);
// 			fs.readFile(dest_file, async function(err, data) {
// 				if (err) {
// 					res.json({
// 						success : 0,
// 						message  : "上传失败",
// 						url     : "",
// 					})
// 				} else {
// 					var base64 = await Buffer.from(data, 'binary').toString('base64');
// 					_res.json({
// 						success : 1,
// 						message : "上传成功",
// 						url: "data:image/" + extname + ";base64," + base64,
// 					});
// 				}
// 				fs.unlink(dest_file, function(err) {
// 					console.log(err);
// 				})
// 			})
// 		})
// 	});
// })

router.post('/image', jwt.auth, upload.any(), async (req, res, next) => {
	var tmpPath = path.join(__dirname, "../upload_tmp");
	var id = req.query.id.split('-').pop();
	var uid = uuid.v1();
	var reg = new RegExp(" ", "g");
	var fileName = req.files[0].originalname.replace(reg, '-');
	var filePath = path.join(tmpPath, uid + "-" + fileName);
	var extname = path.extname(fileName).split(".").pop();
	fileName = path.join("article", id, uid, fileName);
	if (parseInt(["jpg", "png", "gif", "jpeg"].indexOf(extname)) == -1) {
		fs.unlink(req.files[0].path, (err) => {
			if (err) console.log(err);
		})
		return res.json({
			success: 0,
			message: "图片格式不合法，应为JPG、GIF、PNG格式",
			url: "",
		});
	}
	fs.readFile(req.files[0].path, function(err, data) {
		writeFileRecursive(filePath, data, async function(err) {
			fs.unlink(req.files[0].path, (err) => {
				if (err) console.log(err);
			});
			if (err) {
				console.log(err);
				return res.json({
					success : 0,
					message  : "上传失败",
					url     : "",
				})
			}
			var fileSize = getFileSize(filePath);
			if (fileSize > parseInt(CONFIG.upload.limitSize)) {
				fs.unlink(filePath, (err) => {
					if (err) console.log(err);
				})
				res.json({
					success: 0,
					message: "图片大小不能超过2M",
					url: "",
				});
			} else {
				if (parseInt(["jpg", "jpeg", "png", "gif"].indexOf(extname)) > -1) {
					await imagemin([filePath], {
						destination: tmpPath,
						plugins: [
							imageminJpegtran(),
							imageminPngquant({
								quality: [0.6, 0.8]
							})
						],
						use: [
							imageminWebp({quality: 50})
						]
					});
				}
				var ok = await minio.upload(fileName, filePath);
				if (ok) {
					res.json({
						success: 0,
						message: "上传失败",
						url : "",
					});
				} else {
					res.json({
						success: 1,
						message: "上传成功",
						url: path.join(CONFIG.upload.url, fileName),
					});
				}
				fs.unlink(filePath, (err) => {
					if (err) console.log(err);
				});
			}
		})
	})
});

module.exports = router;