var gulp    = require('gulp');
var less    = require('gulp-less');
var connect = require('gulp-connect');
var hbs     = require('gulp-hb');

gulp.task('connect', function() {
  connect.server();
});

gulp.task('compile', function() {
  gulp.src('templates/index.html')
    .pipe(hbs({
//        data: 'data/**/*.{js,json}',
//        helpers: 'helpers/*.js',
        partials: 'templates/*.hbs'
    }))
    .pipe(gulp.dest('compiled'));
})

gulp.task('less', function () {
	gulp.src('style/less/style.less')
    	.pipe(less())
    	.pipe(gulp.dest('style'))
      .pipe(gulp.dest('compiled/style'))
});

gulp.task('default', function() {
	gulp.run('compile')
  gulp.run('less');
	gulp.run('connect');
  	var watchLess = gulp.watch('style/less/*.less', ['less']);
});
