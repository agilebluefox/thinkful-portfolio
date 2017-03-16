'use strict';

const gulp = require('gulp');
const del = require('del');
const config = require('./gulp.config.js')(); // Load the config settings
const browserSync = require('browser-sync');

// loads all of the gulp plugins, substitute $ for gulp-
const $ = require('gulp-load-plugins')({
    lazy: true
});

// Get a list of all the gulp tasks in this file
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

// Inject the css and js links into the html file
gulp.task('index', ['clean:index'], () => {
    let target = gulp.src(config.index);
    let sources = gulp.src([config.css + '**/*.css'], {
        read: false
    });
    return target.pipe($.inject(sources))
        .pipe(gulp.dest(config.client));
});

gulp.task('styles', ['clean:styles'], ()=> {
    log('Compiling sass files to css');
    return gulp.src(config.client + 'css/*/*.scss')
        .pipe($.sass())
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe(gulp.dest(config.css));
});

// Copy the bootstrap scss files to the styles directory
gulp.task('copy-bootstrap', () => {
    return gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest(config.css));
});

// Optimize images for the site
gulp.task('images', ['clean:images'], () => {
    log('Optimizing images...');
    return gulp
        .src(config.images)
        .pipe($.imagemin({
            optimizationLevel: 4
        }))
        .pipe(gulp.dest(config.build + '/images'));
});

// Task to clean styles directory
// Since the stream is not returned, use callback to signal when completed
gulp.task('clean:styles', (done) => {
    log('Cleaning out the old stylesheets...');
    const files = config.client + 'css/**/*.css';
    clean(files);
    done();
});

// Remove the current version of the index file in the build directory
gulp.task('clean:index', (done) => {
    log('Cleaning the index.html file...');
    const file = config.client + 'index.html';
    clean(file);
    done();
});

// Remove any images in the build directory
gulp.task('clean:images', (done) => {
    log('Cleaning out the old images...');
    const files = config.client + 'images/**/*.*';
    clean(files);
    done();
});


// Activate browser-sync and watch for changes
gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: config.client
        }
    });
});

// Function to clean directories prior to build
function clean(path) {
    log('Cleaning ' + $.util.colors.blue(path));
    // del takes a callback as it's second argument
    del(path);
}

// Logging function
function log(msg) {
    if (typeof (msg) === 'object') {
        for (let item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}