var browserify  = require('browserify'),
    cache       = require('gulp-cached'),
    compression = require('compression'),
    express     = require('express'),
    gutil       = require('gulp-util'),
    gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    hbsfy       = require('hbsfy'),
    jshint      = require('gulp-jshint'),
    jsonlint    = require('gulp-jsonlint'),
    less        = require('gulp-less'),
    path        = require('path'),
    rename      = require('gulp-rename'),
    shim        = require('browserify-shim'),
    source      = require('vinyl-source-stream'),
    sourcemaps  = require('gulp-sourcemaps'),
    streamify  = require('gulp-streamify'),
    uglify	    = require('gulp-uglify')

var err = function(err) {
    gutil.beep()

    if (!prod()) {
        gutil.log(err)
    } else {
        throw err
    }
}

var prod = function() {
    return process.env.WERCKER
}

gulp.task('webserver', function() {
    var app = express()
    app.use(compression({
        threshold: 512
    }))

    // app.use(express.static(__dirname))
    app.get('*.js', function(req, res) {
        res.sendFile(path.join(__dirname, req.originalUrl))
    })
    app.get('*.css', function(req, res) {
        res.sendFile(path.join(__dirname, req.originalUrl))
    })
    app.get('/test.html', function(req, res){
        res.sendFile(path.join(__dirname,'test.html'))
    })
    app.get('/*', function(req, res){
        res.sendFile('index.html')
    })
    app.listen(8080);
})

gulp.task('lintjs', function(){
    return gulp.src(['js/**/*.js', 'strings/**/*.js'])
        .pipe(cache('jslint'))
        .on('error', err)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter(''))
})

gulp.task('lintjson', function(){
    return gulp.src(['js/**/*.json', 'strings/**/*.json'])
        .pipe(cache('jsonlint'))
        .pipe(jshint())
        .on('error', err)
        .pipe(jshint.reporter('default'))
})

gulp.task('buildjs', function(){
        var b = browserify({
            entries: ['./js/app.js'],
            paths: [
                './node_modules/',
                './',
                './libs/',
                './strings/',
                './templates/'
            ]
        })
        .transform(hbsfy)
        .ignore('express')
        .plugin(shim, {
            jquery: {
                path: require.resolve('jquery'),
                exports: '$'
            },
            bootstrap: {
                path: './node_modules/bootstrap/dist/js/bootstrap.js',
                depends: {
                    jquery: '$'
                },
                exports: null
            }
        })
        .bundle({ debug: false  })
        .on('error', err)
        .pipe(source('app.js'))
        .pipe(gulpif(prod, streamify(sourcemaps.init())))
        .pipe(gulpif(prod, streamify(uglify())))
        .pipe(gulpif(prod, streamify(sourcemaps.write('./'))))
        .pipe(gulp.dest('./'))
        //.pipe(gutil.log('Done!'))
})

gulp.task('buildcss', function(){
    var opts = {
        paths: [path.join(__dirname, 'node_modules/bootstrap/less')],
    }

    if (prod()) {
        opts.compress = true
    }

    gulp.src('./less/investorball.less')
        .pipe(less(opts))
        .on('error', err)
        .pipe(rename('app.css'))
        .pipe(gulp.dest('./'))
})

gulp.task('done', function(){
    gutil.log('Done!')
})
gulp.task('watch', function(){
    gulp.watch([
        './js/**',
        './libs/**',
        './templates/**'
    ],[
        'lintjs',
        'buildjs',
    ])

    gulp.watch(['./strings/**'], ['lintjson', 'buildjs'])
    gulp.watch(['./less/**'], ['buildcss'])
})

gulp.task(
    'dev', [
        'lintjs',
        'lintjson',
        'buildjs',
        'buildcss',
        'watch'
])

gulp.task(
    'devserver', [
        'dev',
        'webserver'
])
