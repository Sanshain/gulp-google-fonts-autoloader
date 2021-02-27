# gulp-google-fonts-autoloader

a super-smart plugin for gulp that automatically saves the font families specified in the google font styles to your local machine in accordance with the font localization 
specified in the task and replaces the path to the font families in the css file with the corresponding file

# using

### gulpfile.js:

```js
gulp.task('less', function () {  

  return gulp.src('./style/packages/**/*.less')
    .pipe(cache('less', {
      optimizeMemory: true
    }))
    .pipe(sourcemaps.init())
    .pipe(fontParser({ lang: 'cyrillic', 'format': 'woff2', static_url: '/static/'}))    
    .pipe(less({}))        
    .pipe(cssnano())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./style'));
});
```

### sources: 

```css
/*some css/less/etc */
@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
```

### release:

```css
/* cyrillic */
@font-face {
  font-family: 'Lobster';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(/static/fonts/neILzCirqoswsqX9zoamM5Ez.woff2) format('woff2');
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
```

- and the font-family file will be saved to `/static/fonts/neILzCirqoswsqX9zoamM5Ez.woff2` after the task finish



