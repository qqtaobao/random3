let gulp=require("gulp");
let uglify=require("gulp-uglify");//压缩文件
let babel=require("gulp-babel");//es6转es5
let concat=require("gulp-concat")//合并
let cleanCss=require("gulp-clean-css")//压缩css
let sass=require("gulp-sass")//cass 转css
let webserver=require("gulp-webserver");//服务器
let webpack=require("webpack-stream")// webpack插件



gulp.task("uglify",()=>{
    gulp.src("./local/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./server/js"))
})

gulp.task("babel",()=>{
    gulp.src("./local/js/*.js")
        .pipe(babel({
            presets:["@babel/env"]
        }))
        .pipe(uglify())
        .pipe(gulp.dest("./server/js"))
})

gulp.task('concat',()=>{
    gulp.src("./local/js/*.js")
        .pipe(babel({ 
            presets:["@babel/env"]
        }))
        .pipe(uglify())
        .pipe(concat("all.js"))
        .pipe(gulp.dest("./server/js/"))
})

gulp.task("cleanCss",()=>{
    gulp.src("./local/scss/*.scss")
         .pipe(cleanCss({ compatibility:"ie8"

         }))
         .pipe(gulp.dest("./server/css"))
})

gulp.task("css",()=>{
    gulp.src("./local/scss/*.css")
        .pipe(cleanCss({ compatibility:"ie8"}))
        .pipe(gulp.dest("./server/css"))
})
gulp.task("sass",()=>{
    gulp.src("./local/scss/*.scss")
        .pipe(sass().on("error",sass.logError))
        .pipe(cleanCss({ compatibility:"ie8"}))
        .pipe(concat("all.css"))
        .pipe(gulp.dest("./server/css"))
})
gulp.task("html",()=>{
    gulp.src("./local/html/*.html")
        .pipe(gulp.dest("./server/html"))
})

//监听

gulp.task("watching",()=>{
    gulp.watch("./local/**/*.scss",["sass"])
    gulp.watch("./local/**/*.js",["babel"])
    gulp.watch("./local/html/*.html",["html"])
})

gulp.task("webserver",()=>{
    gulp.src("server")//创建服务器所在文件
        .pipe(webserver({
            https:true,
            livereload:true,
            open:true, //自动打开页面
            directoryListing:true,
            proxies:[
                {
                    source:"/listmore",
                    target:'https://m.lagou.com/listmore.json?pageNo=2&pageSize=15',
                }
            ]

        }));
})
gulp.task("see",["webserver","watching"]) 


ulp.task("webpackJS", ()=>{
	webpack({
		mode: "development",  //模式
		entry: ["./local/js/*.js"],  //配置入口文件，及打包时，webpack从哪个文件开始读取
		output: {
		  	filename: 'app.js', //打包生产后的文件名称
		},
		module : {
			rules:  [
				{
					test: /\.js$/,   //匹配.js文件
					exclude: /(node_modules|bower_components)/,   //将node_modules里的JS排除
				  	use: {  //配置babel-loader用来编译ES6、7语法
						loader: 'babel-loader',  
						options: {
							presets: ['@babel/preset-env']
						}
				  	}
				},
				{
					test: /\.scss$/, //匹配.scss文件
				  	use: [	
						"style-loader", //用于将css文本写在页面的style标签中
						"css-loader", //用于加载css文件
						"sass-loader" //用于加载scss并编译生成css文件
					] 
				}
			]
		}
	})
	.pipe( gulp.dest("./server/webpack/") ) //将打包后的app.js复制到哪里
})
