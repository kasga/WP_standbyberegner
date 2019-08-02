var gulp = require("gulp");

// Requires the gulp-sass plugin
var sass = require("gulp-sass");

gulp.task("sass", function() {
  return gulp
    .src("assets/scss/z_de_standby.scss")
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest("assets/css"));
});

gulp.task("watch", function() {
  gulp.watch("assets/scss/**/*.scss", gulp.series("sass"));
});
