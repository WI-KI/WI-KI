const gulp = require("gulp");
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const htmlmin = require('gulp-html-minifier');
const cdnPath = ".";

function cleanFile(source) {
    return gulp.src(source)
               .pipe(clean({force: true}));
}

function cleanBuild() {
    return (
        cleanFile(["../CDN/*.js", "../CDN/*.css"]),
        cleanFile("./pc/*")
    );
}

function toCDN() {
    return gulp.src(["../pc/dist/*.js", "../pc/dist/*.css", "../pc/dist/wi-ki_logo_round.png"])
               .pipe(gulp.dest("../CDN"));
}

function htmlMin(source, destion) {
	return gulp.src(source)
		.pipe(htmlmin({
			removeComments: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			removeEmptyAttributes: true,
			collapseBooleanAttributes: true,
			collapseWhitespace: true,
			minifyJS: true,
			minifyCSS: true
		}))
		.pipe(concat('index.html'))
		.pipe(gulp.dest(destion));
}

function toPC() {
    return (
        htmlMin("../pc/dist/index.html", "./pc"),
        gulp.src(["../pc/dist/editor.md/**/*"])
        .pipe(gulp.dest(`./pc/${cdnPath}/editor.md`))
    );
}

exports.cleanBuild = cleanBuild;
exports.toCDN = toCDN;
exports.toPC = toPC;
exports.default = gulp.series(cleanBuild, toCDN, toPC);

