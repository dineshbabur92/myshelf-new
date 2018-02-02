var gulp = require("gulp");
var mocha = require("gulp-mocha");
var nodemon = require('gulp-nodemon')

gulp.task("mocha", function(){
	return gulp.
		src("./test.js").
		pipe(mocha());
});

gulp.task("watch", function(){
	gulp.watch("./*.js", ["mocha", "node index"])
});

gulp.task('serve', function () {
  nodemon({ 
  				script: 'index.js'
          , ext: 'html js'
          // , ignore: ['ignored.js']
          // , tasks: ['lint'] 
        })
    .on('restart', function () {
      console.log('restarted!')
    })
})