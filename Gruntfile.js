module.exports = function(grunt){
	grunt.initConfig({
		nodemon: {  //自动重启项目工程插件
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoresFiles: ['README.md', 'node_modules/**',],
					watchedExtensions: ['js'],
					watchedFolders: ['app','config'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},
		watch: {  //指定任务，该任务下有jade与js两个目标，实时监控项目
			jade: {
				files: ['views/**'],
				options: {
					liverload: true  //文件出现改动时重新启动服务
				}
			},
			js: {
				files: ['public/javascripts/**'],
				options: {
					liverload: true  //文件出现改动时重新启动服务
				}
			},
			less: {
				files: ['public/less/**'],
				options: {
					liverload: true  //文件出现改动时重新启动服务
				}
			}
		},
		
		jshint: {
			options: {
        		jshintrc: '.jshintrc',
        		ignores: ['public/libs/**/*.js']
      		},
      		all: ['public/javascripts/**']
		},
		uglify:{
				options: {
					mangle: {
					except: ['jQuery', 'Backbone']
					}
				},
				my_target: {
					files: {
					'public/dist/app.min.js':['public/dist/app.js']
					}
				}
		},
		less: {
			development: {
    			options: {
      				// compress: true,
          			yuicompress: true,
          			optimization: 2,
          			ieCompat: true,
    			},
    			files: {
      				'public/stylesheets/index.css': 'public/less/index.less'
    			}
  			}
		},
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
		},
		concurrent: {
			tasks: ['nodemon', 'watch', 'requirejs', 'less', 'jshint','uglify'],
			options: {
				logConcurrentOutput: true //并发输出日志记录
			}
		}
	});
	grunt.option('force', true);
	grunt.registerTask('default', ['concurrent']);
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	
}