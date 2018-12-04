// Add dependencies
var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-clean-css');
var rename = require('gulp-rename');

// Set constants
const SCSS_SRC = './src/assets/scss/**/*.scss';
const SCSS_DEST = './src/assets/css';

// Magically transform sass into minified css
gulp.task('sass', function() {
    return gulp.src(SCSS_SRC)
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(SCSS_DEST))
});

// Watch with the magical sass task
gulp.task('default', function() {
    gulp.watch(SCSS_SRC, ['sass']);
});