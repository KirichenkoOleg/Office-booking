
const gulp = require ("gulp");//подключаем gulp
const uglify = require ("gulp-uglify");//минифицирование js
const concat = require ("gulp-concat");//конкатынация файлов, склеивает файдлы
const minifyCss = require ("gulp-minify-css");
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const shell = require('gulp-shell'); //позволит отследить последовательность выполнения задач
const browserSync = require('browser-sync');
const runSequence = require('run-sequence'); //запускает задачи по очереди
const reload = browserSync.reload;
const sass = require('gulp-sass');
const sourcemaps = require ('gulp-sourcemaps');

const path = {
	src: {
		html: "app/index.html",
		styles: [
			"app/styles/main.sass",
			"app/styles/**/*.sass"
		],
		js: [
			"app/js/script.js"
		],
		image: "app/img/**/*",
		fonts: "app/fonts/**/*",
		data: "app/data/*.json"
	},
	build: {
		html: "build/",
		css: "build/css/",
		js: "build/js/",
		image: "build/img/",
		fonts: "build/fonts/",
		data: "build/data/"
	}
};


gulp.task('sass', function(){
	return gulp.src(path.src.styles)
		.pipe(sourcemaps.init()) //активация sourcemaps
		.pipe(sass().on('error', sass.logError)) //компиляция в css
		.pipe(minifyCss()) //минификация
		.pipe(concat('style.css')) // соединение в один
		.pipe(sourcemaps.write('.')) //активация sourcemaps
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

gulp.task('script', function() {
    return gulp.src(path.src.js)
		.pipe(concat('main.js'))
		.pipe(uglify().on('error', function(e){
			console.log( e );
		}))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task('html', function() {
	return gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('fonts', function(){
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({stream: true}));
});

gulp.task('images', function() {
	return gulp.src(path.src.image)
		.pipe(imagemin([
		    imagemin.gifsicle({interlaced: true}),
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 5}),
		    imagemin.svgo({
		        plugins: [
		            {removeViewBox: true},
		            {cleanupIDs: false}
		        ]
		    })
		], {
		    verbose: true
		}))
		.pipe(gulp.dest(path.build.image));
});

gulp.task('datas', function(){
	return gulp.src(path.src.data)
		.pipe(gulp.dest(path.build.data))
		.pipe(reload({stream: true}));
});

gulp.task('build', shell.task([
	'gulp clean',
	'gulp html',
	'gulp sass',
	'gulp script',
	'gulp images',
	'gulp fonts',
	'gulp datas'
	]));

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build" //прописываем адрес откуда открыть
        }
    });
});

gulp.task('watch', function(){
	gulp.watch('app/index.html', ['html'])
	gulp.watch('app/styles/**/*.sass', ['sass'])
	gulp.watch('app/styles/main.sass', ['sass'])
	gulp.watch('app/js/*.js', ['script'])
	gulp.watch('app/data/*.json', ['datas'])
});

gulp.task('clean', function() {
	return gulp.src('build')
		.pipe(clean());
});

gulp.task('server', function(){
    runSequence('build', 'browser-sync', 'watch');
});

gulp.task('default', ['server']);