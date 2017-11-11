# scss-starter
Simple scss for my personal usage. It contain common styles, mixins, variables and other useful stuffs

## Note: This is not only for personal usage

## Structure of helper
- _pages
  - _index.scss
  - _single.scss 
  - _other.scss
- _common 
  - _device.scss
  - _utlities.scss 
  - _buttons.scss
  - _form.scss
  - _mixins.scss
  - _keyframes.scss
	- _table.scss 
	- _dashboard.scss 
- main.scss 


#### Main.scss
It load all scss styles, device.scss has breakpoints, variables has couple of color, width etc. utlitities has common useful classes like padding, margin and all useful styles.


#### Technologies 

- ES6
- SASS/SCSS
- Gulp Babel
- PostCSS


### Required packages 

##### Install globally 

```
sudo npm install typescript@latest  babel-cli@latest babel-core@latest
babelify@latest browserify@latest gulp postcss -g
```

##### Install locally, dev dependencies

```
npm  install autoprefixer babel-cli babel-core babel-preset-env babel-preset-es2015 babel-preset-es2017 babel-preset-latest babelify browserify cssnano dotenv gulp gulp-babel gulp-browserify gulp-concat gulp-plumbe gulp-postcss gulp-rename gulp-sass gulp-typescript gulp-uglify install postcss postcss-color-function typescript vinyl-buffer vinyl-source-stream 
browser-sync -D
```

##### Install locally, dependencies 

```
npm install  bootstrap dropzone font-awesome foundation-sites highcharts jquery jquery-slimscroll popper.js slick-carousel -S
```
> 
	- Webpack 
	- React 
	- Post CSS
	- ELM 