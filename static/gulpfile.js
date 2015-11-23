var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer');
gulp.task('sass', function() {
    // var filter = gulpFilter('!./sass/pages');
    return sass('./sass/pages', {
            style: 'compact',
            sourcemap: true
        })
        // .pipe(filter)
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: './sass/'
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream())

})

// gulp.task('concat',['sass'],function(){
//     return gulp.src(['./css/ngDialog.css'])
//     .pipe(sourcemaps.init())
//     .pipe(concat('index.min.css'))
//     .pipe(minifyCss())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('./css'))
// })

// gulp.task('scripts', function() {
//     return gulp.src('./js/admin/*.js')
//         .pipe(amdOptimize("admin"))
//         .pipe(concat("index.js"))
//         .pipe(gulp.dest("dist"));
// });

// gulp.task('upload', function() {
//     return gulp.src('./css/*.css', {
//             buffer: false
//         })
//         .pipe(sftp({
//             host: '169.53.6.220',
//             user: 'root',
//             port: 22,
//             key: 'd:\\My Documents\\server2',
//             remotePath: '/var/www/alluregal/skin/frontend/default/rosegal/js'
//         }))
// })
gulp.task('server', ['sass'], function() {
    browserSync.init({
        server: "./"
    });
    gulp.watch('./sass/pages/*.scss', ['sass']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('default', ['server']);
