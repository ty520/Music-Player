# Music-Player
此播放器制作采用的主要技术：HTML5（webAudio）+ canvas +RequireJS + Node.js + Ajax



1.搭建基于Node平台的音乐播放器；

2.利用AJAX技术发起get请求本地音频资源；

3.利用HTML5的canvas技术制作音频的圆柱显示状态和原点显示状态;

4.利用grunt在线调试、打包、压缩js文件，并在线实时编译less;

5.利用requireJS模块化JS代码；


6.技术难点如下：

webAudio对音频的分析；

HTML5根音频，利用canvas绘制音频矩形图和原点图；

grunt-contrib-requirejs配置：


requirejs: {
			compile: {
				options: {
					baseUrl : 'public/javascripts',
					optimize: 'uglify',
					path:{index: 'index'},
					mainConfigFile: 'public/javascripts/index.js',
					name : "index", 
              		out: "public/dist/app.js"
				}
				
			}
		}
		
7.安装步骤：clone代码->npm install（安装依赖的库文件）-> 运行服务器grunt 

