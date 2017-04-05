'use strict';

const gulp = require('gulp');
const surge = require('gulp-surge');
const del = require('del');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const config = require('./gulp.config.js')(); // Load the config settings
const browserSync = require('browser-sync');

// loads all of the gulp plugins, substitute $ for gulp-
const $ = require('gulp-load-plugins')({
    lazy: true
});

// Get a list of all the gulp tasks in this file
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

// Deploy the static files to surge
gulp.task('deploy', ['index'], () => {
    log('Deploying to Surge...');
    return surge({
        project: config.build, // Path to your static build directory
        domain: 'david-conner.surge.sh' // Your domain or Surge subdomain
    });
});

// Inject the css and js links into the html file
gulp.task('index', ['clean:index'], () => {
    log('Updating the index file...');
    let target = gulp.src(config.client + 'index.html');
    let sources = gulp.src([config.bsCss], {
        read: false
    });
    return target.pipe($.inject(sources, {
            relative: true,
            ignorePath: '../build'
        }))
        .pipe(gulp.dest(config.build));
});

gulp.task('styles', ['copy-bootstrap'], () => {
    log('Compiling sass files to css');
    return gulp.src(config.css + '**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 1%'],
            flexbox: true
        }))
        .pipe(gulp.dest(config.build + 'styles/'));
});

// gulp.task('compile-bs', () => {
//     log('Compile bootstrap');
//     return gulp.src('node_modules/bootstrap/scss/bootstrap.scss')
//         .pipe(sass({
//             outputStyle: 'compressed'
//         }).on('error', sass.logError))
//         .pipe(postcss([require('postcss-flexbugs-fixes')]))
//         .pipe($.autoprefixer({
//             browsers: ['last 2 version', '> 1%'],
//             flexbox: true
//         }))
//         .pipe(gulp.dest(config.build + 'styles/'));

// });

// Copy the bootstrap scss files to the styles directory
// TODO: Use the minimized version in production
gulp.task('copy-bootstrap', ['clean:styles'], () => {
    return gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css')
        .pipe(gulp.dest(config.build + 'styles/'));
});

// Optimize images for the site
gulp.task('images', ['clean:images'], () => {
    log('Optimizing images...');
    return gulp
        .src(config.images)
        .pipe($.imagemin({
            optimizationLevel: 4
        }))
        .pipe(gulp.dest(config.build + 'images/'));
});

gulp.task('scripts', ['clean:scripts'], () => {
    return gulp.src(config.client + 'scripts/**/*.js')
        .pipe(gulp.dest(config.build + 'scripts/'));
});

// Task to clean styles directory
// Since the stream is not returned, use callback to signal when completed
gulp.task('clean:styles', (done) => {
    log('Cleaning out the old stylesheets...');
    const files = config.build + 'styles/**/*.css';
    clean(files);
    done();
});

// Remove the current version of the index file in the build directory
gulp.task('clean:index', (done) => {
    log('Cleaning the index.html file...');
    const file = config.build + 'index.html';
    clean(file);
    done();
});

// Remove any images in the build directory
gulp.task('clean:images', (done) => {
    log('Cleaning out the old images...');
    const files = config.build + 'images/**/*.*';
    clean(files);
    done();
});

gulp.task('clean:scripts', (done) => {
    log('Cleaning the scripts...');
    const file = config.build + 'scripts/**/*.js';
    clean(file);
    done();
});

// Activate browser-sync and watch for changes
gulp.task('serve', ['styles', 'index'], () => {
    gulp.watch(config.css + '*.scss', ['styles']);
    gulp.watch(config.client + 'index.html', ['index']);
    browserSync.init([config.bsIndex, config.bsCss, config.bsJs], {
        server: {
            baseDir: config.build
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