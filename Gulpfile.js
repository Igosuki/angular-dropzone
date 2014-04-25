var gulp = require('gulp');

var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var html2js = require('gulp-html2js');
var clean = require('gulp-clean');
var notify = require('gulp-notify');

var paths = {
  coffee: ['src/**/*.coffee'],
  scripts: ['tmp/**/*.js'],
  images: 'img/**/*',
  styles: 'src/**/*.scss',
  templates: 'src/**/*.html',
  dist: 'dist',
  tmp: 'tmp'
};
var finalName = 'angular-dropzone-tpl';

gulp.task('scripts', ['templates', 'coffee'], function() {
  gulp.src(paths.scripts)
    .pipe(concat(finalName+'.js'))
    .pipe(gulp.dest(paths.dist));
  gulp.src(paths.dist+'/'+finalName+'.js')
    .pipe(uglify())
    .pipe(concat(finalName+'.min.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe( notify({ message: "Uglified and minified angular-dropzone"}));
});

gulp.task('coffee', function () {
  return gulp.src(paths.coffee)
    .pipe(coffee())
    .pipe(concat('angular-dropzone.js'))
    .pipe(gulp.dest(paths.tmp));
});


gulp.task('templates', function() {
 return gulp.src(paths.templates)
    .pipe(html2js({
      outputModuleName: 'angular-dropzone-tpls',
      useStrict: true
    }))
    .pipe(concat('angular-dropzone-templates.js'))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('clean', function() {
  return gulp.src([paths.dist, paths.tmp], {read: false})
    .pipe(clean({force: true}));
});

// Copy all static images
gulp.task('images', function() {
 return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('dist/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.start('clean');
  gulp.start('build');
  gulp.watch(paths.coffee, ['scripts']);
  gulp.watch(paths.templates, ['scripts']);
  gulp.watch(paths.images, ['images']);
});

gulp.task('default', ['clean', 'build']);
// The default task (called when you run `gulp` from cli)
gulp.task('build', ['scripts', 'images']);
