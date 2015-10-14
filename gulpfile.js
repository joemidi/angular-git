/**
 * STANDARD GULP BUILD TASKS
 *      by Leon Baird
 *      leonbaird@mac.com
 *      MIT license - permission to use and change at will
 *      and distribute freely
 *
 * Gulp bulk Task runners:
 *      gulp (default build)
 *      gulp build (default build)
 *      gulp build:clean (default build with clean)
 *      gulp build:min (default build with minified css and js)
 *      gulp build:clean:min (default build with clean and minifed css and js)
 *      gulp build:final (outputs final production build:
 *           cleans build, copies and only produces minified
 *           and concatinated/browserfied css and js)
 *      gulp watch (watch making css and js builds only and individually,
 *           with no minifaction, fastest build times)
 *      gulp watch:copy (watch making css and js build builds only and
 *           individually, running the copy script on each build,
 *           but with no minifaction)
 *      gulp watch:clean (watch making default build, with clean and
 *           no minifaction)
 *
 * Gulp Individual tasks
 *      gulp clean (erases marked folder - default 'dest')
 *      gulp copy (copies marked files from src to dest)
 *      gulp css (concatinates all css into 'css/styles.css')
 *      gulp css:min (concatinates and minifies into 'css/styles.min.css')
 *      gulp browserify (concatinates and browserify all js to 'js/main.js')
 *      gulp browserify:min (concatinates, browserify and uglify all js to 'js/main.min.js')
 */

// Imports
var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var filesize    = require('gulp-filesize');
var minifyCSS   = require('gulp-minify-css');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var del         = require('del');

/************************************************************
 * Settings Start
 * Modify any of these settings to control build processes
 */

// JS Source file (browserify will process all root nodes,
// use .add() from browserify pipeline)
var sourceFilePathJS = './src/js/app.js';
var destinationFilePathJS = './dist/js';
var processFilenameJS = 'app';

// CSS Settings
var sourceFolderCSS = './src/css/**/*.css';
var destinationFolderCSS = './dist/css';
var processFilenameCSS = 'styles';

// copy sources list { src:, dest:} in array
// this example only copies html and all images file from root
// NOTE: you can also add gulp processes to resize and compress images as well
var copyFiles = [
    { src: 'src/index.html',        dest: './dist' },
    { src: 'src/images/**/*.*',     dest: './dist/images' },
    { src: 'src/js/views/**/*.*',   dest: './dist/js/views' }
];

// folders to clean (Delete)
// list folders you want to delete when cleaning a build
var cleanFolders = [ 'dist' ];

// scripts that must be performed first
// used to make sure clean has finished
// if being cleaned, but would force
// cleaning every build if array contains cleaned.
var dependentTasks = [];

/************************************************************
 * Settings END
 *
 * Source code begins:
 */

// cleans dist folder (erases all content AKA clean-build)
gulp.task('clean', function () {
    // if cleaning, ask to make sure task is complete first
    dependentTasks.push('clean');
    return del(cleanFolders);
});

// browserify source code - output as .js
// waits for clean to complete, if running
gulp.task('browserify', dependentTasks, function() {
    // browserify and output
    var b = browserify(sourceFilePathJS);
    return b.bundle()
        .on('error', function(err) {
            console.log(err.toString());
            this.emit("end");
        })
        .pipe( source(processFilenameJS+'.js') )
        .pipe( buffer() )
        .pipe( filesize() )
        .pipe( gulp.dest(destinationFilePathJS) );
});

// Browserify then uglify source code and output as .min.js
// Waits for clean and browserify:js to complete first
// this means main browserify:js completes with faster build
// as uglify slows build time down, and not needed for build testing
gulp.task('browserify:min', dependentTasks, function() {
    var b = browserify(sourceFilePathJS);
    return b.bundle()
        .on('error', function(err) {
            console.log(err.toString());
            this.emit("end");
        })
        .pipe( source(processFilenameJS+'.min.js') )
        .pipe( buffer() )
        .pipe( uglify() )
        .pipe( filesize() )
        .pipe( gulp.dest(destinationFilePathJS) );
});

// merge css into one single file and minify
// wait for clean to complete
gulp.task('css', dependentTasks, function() {
    return gulp.src(sourceFolderCSS)
        .on('error', function(err) {
            console.log(err.toString());
            this.emit("end");
        })
        .pipe( concat(processFilenameCSS+'.css') )
        .pipe( gulp.dest(destinationFolderCSS) )
        .pipe( filesize() )
});

// minify css
gulp.task('css:min', dependentTasks, function() {
    return gulp.src(sourceFolderCSS)
        .on('error', function(err) {
            console.log(err.toString());
            this.emit("end");
        })
        .pipe( concat(processFilenameCSS+'.min.css') )
        .pipe( minifyCSS() )
        .pipe( gulp.dest(destinationFolderCSS) )
        .pipe( filesize() );
});

// copy files
// wait for clean to complete
gulp.task('copy', dependentTasks, function() {
    copyFiles.forEach(function (file) {
        gulp.src(file.src)
            .on('error', function(err) {
                console.log(err.toString());
                this.emit("end");
            })
            .pipe(gulp.dest(file.dest));
    })
});

// create default tasks
gulp.task('default', ['copy', 'css', 'browserify']);
gulp.task('build', ['default']);
gulp.task('build:min', ['copy', 'css', 'browserify', 'css:min', 'browserify:min']);
gulp.task('build:final', ['clean', 'copy', 'css:min', 'browserify:min']);
gulp.task('build:clean', ['clean', 'default']);
gulp.task('build:clean:min', ['clean', 'build:min']);

// create watch tasks for builds without minified versions
// only builds JS and CSS files if altered individually, making for
// fast build times - does not do a copy!
gulp.task('watch', function() {
    gulp.watch('src/css/**/*.css', ['css']);
    gulp.watch('src/js/**/*.js', ['browserify']);
});

// same as normal watch, but will also run the copy
// scripts on every build
gulp.task('watch:copy', function() {
    gulp.watch('src/**/*.*', ['copy']);
    gulp.watch('src/css/**/*.css', ['css']);
    gulp.watch('src/js/**/*.js', ['browserify']);
});

// will do the default build on every change
gulp.task('watch:clean', function() {
    gulp.watch('src/**/*.*', ['build:clean']);
});