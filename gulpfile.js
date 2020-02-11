const gulp = require('gulp');
const plumber = require('gulp-plumber');
const less = require("gulp-less");
const imagemin = require("gulp-imagemin");
const pngquant = require('imagemin-pngquant');
const autoprefixer = require("gulp-autoprefixer");
const concat = require('gulp-concat-css');
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const server = require('browser-sync').create();


gulp.task('image', () =>
    gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/images'))
);

gulp.task("css-page", function() {
    return gulp.src(blocks)
      .pipe(concat('page.css'))
      .pipe(gulp.dest("build/css"))
      .pipe(autoprefixer({
          overrideBrowserslist: ['last 2 versions'],
          cascade: false
      }))
      .pipe(csso())
      .pipe(rename({
          suffix: "-min",
          extname: ".css"
      }))
      .pipe(gulp.dest("./build/css"))
  });

gulp.task("css-min", function() {
    gulp.src("./build/css/**/*.css")
   		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    	.pipe(csso())
    	.pipe(rename({
            suffix: "-min",
            extname: ".css"
        }))
    	.pipe(gulp.dest("./build/css"))
});

gulp.task("cssmin", function() {
    gulp.src("src/less/import.less")
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css/for-min"))
});

gulp.task("css", function() {
  return gulp.src("src/less/**/*.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest("build/css"))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
    }))
    .pipe(csso())
    .pipe(concat("style.css"))
    .pipe(rename({
        suffix: "-min",
        extname: ".css"
    }))
    .pipe(gulp.dest("./build/css"))
    .pipe(server.stream());
});



gulp.task('serve', function() {
    server.init({
        server: {
            baseDir: "build/",
            }
        });

    gulp.watch("src/images/*", gulp.series("image"));
    gulp.watch("src/less/**/*.less", gulp.series("css"));
	gulp.watch("**/*.html").on("change", server.reload);
});
