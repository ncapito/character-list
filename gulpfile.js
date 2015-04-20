var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    zip = require('gulp-zip'),
    Q = require('q'),
    _ = require('lodash'),
    jshintreporter = require('jshint-summary'),
    replace = require('gulp-replace'),
    size = require('gulp-size'),
    del = require('del'),
    rename = require('gulp-rename'),
    karma = require('karma').server,
    ngAnnotate = require('gulp-ng-annotate'),
    htmlmin = require('gulp-htmlmin'),
    ngTemplates = require('gulp-ng-templates'),
    markdown = require('gulp-markdown'),
    plato = require('gulp-plato'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;


var filePath = {
    copyFiles: ['index.html'],
    copyPaths: [{src: 'mocks/**/*', dest: 'mocks/'  }, {src: 'bower_components/font-awesome/fonts/**/*', dest: 'fonts/'} ],
    templates: ['js/**/*.html'],
    clean : [  'dist/**'],
    sass: ['sass/main.scss'],
    src: [
              "js/app.js",
              "js/**/*.js",
    ],
    prejs: [],
    libsjs: [
      "bower_components/jquery/jquery.js",
      "bower_components/modernizr/modernizr.js",
      "bower_components/underscore/underscore.js",
      "bower_components/angular/angular.js",
      "bower_components/angular-cookies/angular-cookies.js",
      "bower_components/angular-animate/angular-animate.js",
      "bower_components/angular-sanitize/angular-sanitize.js",
      "bower_components/angular-resource/angular-resource.js",
      "bower_components/angular-touch/angular-touch.js",
      "bower_components/angular-ui-router/release/angular-ui-router.js",
      "bower_components/moment/moment.js"
  ]
};



gulp.task('copy', [], function(cb){
  console.log("copy running");
  var all = [];
  var stream = gulp.src(filePath.copyFiles)
    .pipe(gulp.dest('dist/'));

  _.each(filePath.copyPaths, function(item){
    var deferred = Q.defer();

    gulp.src(item.src)
      .pipe(gulp.dest('dist/' +  item.dest))
      .on('end', function(){
        console.log(item.src, 'done');
        deferred.resolve();
      });

      all.push(deferred.promise);
  });

  return  Q.all(all).then(function(){
    console.log("All are done");
  });
});


gulp.task('sass', [], function(done) {

  var deferred = Q.defer();
   gulp.src('./sass/main.scss')
    .pipe(sass(
      {
        includePaths: [
            'bower_components',
            'bower_components',
            'bower_components/bourbon/app/assets/stylesheets',
            'sass',
          ],
          compass: false
      }
    ))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./dist/css/'))
    .on('end', function(){
      deferred.resolve();
    });

    return  deferred.promise;
});

function reloadMe(){
  console.log('reload called');
  return reload(arguments);
}
gulp.task('js-watch', ['build'], browserSync.reload);
gulp.task('sass-watch', ['sass'], reloadMe);
gulp.task('templates-watch', ['templates'], browserSync.reload);
gulp.task('copy-watch', ['copy'], reloadMe);



// Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch(filePath.copyFiles, ['copy-watch']);
    gulp.watch(filePath.sass, ['sass-watch']);
    gulp.watch(filePath.templates, ['templates-watch']);
    gulp.watch(filePath.src, ['js-watch']);
});

gulp.task('jshint', function () {
    return gulp.src(filePath.src)
      .pipe(jshint())
      .pipe(jshint.reporter(
          jshintreporter
        )
      ).pipe(size());
});


gulp.task('clean', [], function(cb) {
    del(filePath.clean, {force:true}, cb);
});


gulp.task('templates',[],  function () {
  return gulp.src(filePath.templates)
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(ngTemplates({
    filename: 'templates.js',
    module: 'ubt.marvel.templates',
    prefix: '/js/',
    path: function (path, base) {
      var replace = '/js/';
      return path.replace(base, replace);
    },
  }))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('dist/scripts/'));
});


gulp.task('prejs',  function() {
  return gulp.src(filePath.prejs)
      .pipe(replace(/'use strict'/g, ''))
      .pipe(concat('pre.js'))
      .pipe(gulp.dest('dist/scripts/'))
      .pipe(uglify())
      .pipe(rename({suffix: ".min"}))
      .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('vendorJS', ['prejs'], function() {
  return gulp.src(filePath.libsjs)
      .pipe(replace(/'use strict'/g, ''))
      .pipe(concat('dist.js'))
      .pipe(gulp.dest('dist/scripts/'))
      .pipe(uglify())
      .pipe(rename({suffix: ".min"}))
      .pipe(gulp.dest('dist/scripts/'));
});


gulp.task('scripts', ['templates'], function() {
  return gulp.src(filePath.src.concat(['dist/scripts/templates.min.js']))
      .pipe(concat('ubtmarvel.js'))
      .pipe(ngAnnotate())
      .pipe(gulp.dest('dist/scripts/'))
    //  .pipe(uglify())
      .pipe(rename({extname: ".min.js"}))
      .pipe(gulp.dest('dist/scripts/'));
});


gulp.task('build', ['copy', 'scripts','sass','vendorJS']);
gulp.task('default',['build','browser-sync']);
