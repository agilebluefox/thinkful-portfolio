'use strict';

const gulp = require('gulp');
const del = require('del');
const config = require('./gulp.config')(); // Load the config settings
const browserSync = require('browser-sync');

// loads all of the gulp plugins, substitute $ for gulp-
const $ = require('gulp-load-plugins')({
    lazy: true
});

// Get a list of all the gulp tasks in this file
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

// Task to transpile sass styles to css and add vendor prefixes
gulp.task('styles', ['clean:styles'], () => {
    log('Compiling sass --> CSS...');
    return gulp.src(config.sass)
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe(gulp.dest(config.build + './css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', ['clean:images'], () => {
    log('Optimizing images...');
     return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + '/images'));
});

// Task to clean styles directory
// Since the stream is not returned, use callback to signal when completed
gulp.task('clean:styles', (done) => {
    log('Cleaning out the old stylesheets...');
    const files = config.temp + '**/*.css';
    clean(files);
    done();
});

gulp.task('clean:images', (done) => {
    log('Cleaning out the old images...');
    const files = config.build + 'images/**/*.*';
    clean(files);
    done();
});

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: config.client
        }
    });

    gulp.watch(config.sass, ['styles']);
    gulp.watch(config.index).on('change', browserSync.reload());
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
