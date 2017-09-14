/*!
 * g3
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var gulp = require("gulp");
var babel = require("gulp-babel");
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');

gulp.task("clean", () => {
  return gulp.src("dist/*").pipe(clean({ force: true }));
});

gulp.task("default", ['copy1', 'copy1_1', 'copy2', 'copy2_1', 'copy3', 'copy3_1', 'copy4', 'copy4_1', 'copy5', 'copy5_1', 'copy6', 'copy6_1', 'copy7', 'copy7_1', 'copy7_2', 'copy8', 'copy8_1', 'copy8_2', 'copy8_3', 'copy8_4', 'copy8_5', 'copy9', 'copy9_1', 'copy9_2', 'copy9_3', 'copy9_4', 'copy9_5'], () => {
});

gulp.task("copy1", () => {
  return gulp.src("logon/src/biz/**/*.js")
          .pipe(babel())
          .pipe(uglify({ mangle: { toplevel: true } }))
          .pipe(gulp.dest("dist/biz"));
});

gulp.task("copy1_1", () => {
  return gulp.src("logon/src/biz/package.json")
          .pipe(gulp.dest("dist/biz"));
});

gulp.task("copy2", () => {
  return gulp.src("logon/src/cfg/**/*.js")
          .pipe(babel())
          .pipe(uglify({ mangle: { toplevel: true } }))
          .pipe(gulp.dest("dist/cfg"));
});

gulp.task("copy2_1", () => {
  return gulp.src("logon/src/cfg/package.json")
          .pipe(gulp.dest("dist/cfg"));
});

gulp.task("copy3", () => {
  return gulp.src("logon/src/db/**/*.js")
          .pipe(babel())
          .pipe(uglify({ mangle: { toplevel: true } }))
          .pipe(gulp.dest("dist/db"));
});

gulp.task("copy3_1", () => {
  return gulp.src("logon/src/db/package.json")
          .pipe(gulp.dest("dist/db"));
});

gulp.task("copy4", () => {
  return gulp.src("logon/src/handle/**/*.js")
          .pipe(babel())
          .pipe(uglify({ mangle: { toplevel: true } }))
          .pipe(gulp.dest("dist/handle"));
});

gulp.task("copy4_1", () => {
  return gulp.src("logon/src/handle/package.json")
          .pipe(gulp.dest("dist/handle"));
});

gulp.task("copy5", () => {
  return gulp.src("logon/src/lib/**/*.js")
          .pipe(babel())
          .pipe(uglify({ mangle: { toplevel: true } }))
          .pipe(gulp.dest("dist/lib"));
});

gulp.task("copy5_1", () => {
  return gulp.src("logon/src/lib/package.json")
          .pipe(gulp.dest("dist/lib"));
});

gulp.task("copy6", () => {
  return gulp.src("logon/src/model/**/*.js")
          .pipe(babel())
          .pipe(uglify({ mangle: { toplevel: true } }))
          .pipe(gulp.dest("dist/model"));
});

gulp.task("copy6_1", () => {
  return gulp.src("logon/src/model/package.json")
          .pipe(gulp.dest("dist/model"));
});


gulp.task("copy7", () => {
  return gulp.src("logon/src/backend/*.js")
          .pipe(babel())
          .pipe(uglify({ mangle: { toplevel: true } }))
          .pipe(gulp.dest("dist/backend"));
});

gulp.task("copy7_1", () => {
  return gulp.src("logon/src/backend/package.json")
          .pipe(gulp.dest("dist/backend"));
});


gulp.task("copy7_2", () => {
  return gulp.src("logon/src/backend/run.*")
          .pipe(gulp.dest("dist/backend"));
});

gulp.task("copy8", () => {
  return gulp.src(["logon/src/login/**/*.js", "!logon/src/login/node_modules/**/*"])
          .pipe(babel())
          .pipe(uglify({ mangle: { toplevel: true } }))
          .pipe(gulp.dest("dist/login"));
});

gulp.task("copy8_1", () => {
  return gulp.src(["logon/src/login/**/*.html", "!logon/src/login/node_modules/**/*"])
          .pipe(gulp.dest("dist/login"));
});

gulp.task("copy8_2", () => {
  return gulp.src(["logon/src/login/**/*.css", "!logon/src/login/node_modules/**/*"])
          .pipe(gulp.dest("dist/login"));
});

gulp.task("copy8_3", () => {
  return gulp.src(["logon/src/login/**/*.ico", "!logon/src/login/node_modules/**/*"])
          .pipe(gulp.dest("dist/login"));
});

gulp.task("copy8_4", () => {
  return gulp.src(["logon/src/login/run.*", "!logon/src/login/node_modules/**/*"])
          .pipe(gulp.dest("dist/login"));
});

gulp.task("copy8_5", () => {
  return gulp.src(["logon/src/login/package.json", "!logon/src/login/node_modules/**/*"])
          .pipe(gulp.dest("dist/login"));
});


gulp.task("copy9", () => {
  return gulp.src(["logon/src/manage/**/*.js", "!logon/src/manage/node_modules/**/*"])
          .pipe(babel())
          .pipe(uglify({ mangle: { toplevel: true } }))
          .pipe(gulp.dest("dist/manage"));
});

gulp.task("copy9_1", () => {
  return gulp.src(["logon/src/manage/**/*.html", "!logon/src/manage/node_modules/**/*"])
          .pipe(gulp.dest("dist/manage"));
});

gulp.task("copy9_2", () => {
  return gulp.src(["logon/src/manage/**/*.css", "!logon/src/manage/node_modules/**/*"])
          .pipe(gulp.dest("dist/manage"));
});

gulp.task("copy9_3", () => {
  return gulp.src(["logon/src/manage/**/*.ico", "!logon/src/manage/node_modules/**/*"])
          .pipe(gulp.dest("dist/manage"));
});

gulp.task("copy9_4", () => {
  return gulp.src(["logon/src/manage/run.*", "!logon/src/manage/node_modules/**/*"])
          .pipe(gulp.dest("dist/manage"));
});

gulp.task("copy9_5", () => {
  return gulp.src(["logon/src/manage/package.json", "!logon/src/manage/node_modules/**/*"])
          .pipe(gulp.dest("dist/manage"));
});
