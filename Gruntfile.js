/*global module:false*/
var path = require('path');

module.exports = function(grunt) {
    var basePath = path.resolve('.'),
        pkg = grunt.file.readJSON(basePath + '/package.json'),
        moduleName = pkg.name,
        compileOptions = pkg.compileOptions || {},
        modulePath = pkg.compileOptions.path || moduleName,
        isImageCompress = compileOptions.isImageCompress || false,
        localConf = compileOptions.local || {},
        remoteConf = compileOptions.remote || {},
        depsModule = compileOptions.depsModule ? [].concat(compileOptions.depsModule) : [
            'common'
        ],
        cdnDomain = compileOptions.cdnDomain ? [].concat(compileOptions.cdnDomain) : [
            'http://apps.bdimg.com/developer/static/1/developers/light'
        ],
        remoteBaseDomain = remoteConf.baseDomain ? [].concat(remoteConf.baseDomain) : '',
        remoteCdnDomain = remoteConf.cdnDomain ? [].concat(remoteConf.cdnDomain) : '',
        routerInfo = pkg.router || {},
        packConf = pkg.compileOptions.pack || {},
        receiver = remoteConf.receiver || '',
        copyConf = compileOptions.copy || {},
        dsConf = localConf.ds || {};

    if (!moduleName) {
        throw new Error('You must set a name in package.json');
    }
    var output = pkg.output || 'output';
    for (var ds in dsConf){
        dsConf[ds] = '/' + moduleName + '/' + dsConf[ds];
    }

    var gruntConfig = {
        moduleName: moduleName,
        modulePath: modulePath,
        output: output,
        router: routerInfo,
        depsModule: depsModule,
        localConf: localConf,

        copy: {
            options: {},
            image: {
                files: [{
                    expand: true,
                    cwd: './static',
                    src: '**/*.{jpg,png,gif,ico,cur}',
                    dest: './' + output + '/static/' + moduleName
                }]
            },
            swf: {
                expand: true,
                cwd: './static',
                src: '**/*.swf',
                dest: './' + output + '/static/' + moduleName
            },
            js: {
                expand: true,
                cwd: './static',
                src: '**/*.js',
                dest: './' + output + '/static/' + moduleName
            },
            dust: {
                expand: true,
                cwd: './static',
                src: 'ui/**/*.dust',
                dest: './' + output + '/static/' + moduleName
            },
            css: {
                expand: true,
                cwd: './static',
                src: '**/*.css',
                dest: './' + output + '/static/' + moduleName
            },
            html: {
                expand: true,
                cwd: './static',
                src: '**/*.html',
                dest: './' + output + '/static/' + moduleName
            },
            tpl: {
                expand: true,
                cwd: './site',
                src: '**/*',
                dest: './' + output + '/site/' + moduleName
            },
            test: {
                expand: true,
                cwd: './',
                src: 'test/**/*',
                dest: '../output/' + moduleName
            },
            custom: {
                files: copyConf
            }
        },

        less: {
            options: {},
            all: {
                files: [{
                    expand: true,
                    cwd: './static',
                    src: '**/*.less',
                    dest: './' + output + '/static/' + moduleName,
                    ext: '.css',
                    extDot: 'last'
                }]
            }
        },

        csslint: {
            options: {
                'compatible-vendor-prefixes': false,
                'universal-selector': false,
                'vendor-prefix': false,
                'box-model': false,
                'display-property-grouping': false,
                'fallback-colors': false,
                'box-sizing': false,
                'outline-none': false,
                'ids': false,
                'adjoining-classes': false,
                'font-sizes': false,
                'duplicate-background-images': false,
                'floats': false
            },
            all: {
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: [
                        'static/' + moduleName + '/**/*.css',
                        '!static/**/q.g.reset.css'
                    ]
                }]
            }
        },

        jshint: {
            options: {
                browser: true,
                curly: true, //必须使用大括号包裹
                newcap: true, //首字母大写的函数，使用new调用
                noarg: true, //禁用 arguments.callee & arguments.caller
                boss: true, //禁止形如：if(a=1){}这样的表达式
                es3: true, //支持es3
                camelcase: false, //强制驼峰命名
                forin: false, //强制for in  进行hasOwnProperty判断
                quotmark: 'single', //强制单引号
                maxparams: 6, //设置参数上限
                asi: true,
                loopfunc: true,
                shadow: true
            },
            dev: {
                options: {
                    debug: true
                },
                files: [{
                    expand: true,
                    cwd: './',
                    src: [
                        'static/**/*.js',
                        '!static/**/{jquery,zepto,require,dust-core,dust-helpers,' +
                        'css,q.g.util,form_validate,beautify,get_form_data}*.js',
                    ]
                }]
            },
            online: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: [
                        'static/**/*.js',
                        '!static/**/{jquery,zepto,require,dust-core,dust-helpers,' +
                        'css,q.g.util,form_validate,beautify,get_form_data}*.js'
                    ]
                }]
            }
        },

        dust: {
            options: {
                wrapperOptions: {
                    templatesNamesGenerator: function(dustInfo, outputName){
                        var outputs = outputName.split('/'),
                            wrapName = moduleName + '/' + outputs[1];

                        for (var i = 3, len = outputs.length ; i < len ; i++){
                            var addedPath = outputs[i];
                            if (i == len - 1){
                                addedPath = path.basename(addedPath, '.dust');
                            }
                            wrapName += '/' + addedPath;
                        }
                        return wrapName;
                    }
                },
                runtime: false
            },
            all: {
                files: [{
                    expand: true,
                    cwd: './' + output + '/static/' + moduleName,
                    src: ['**/*.dust'],
                    dest: './' + output + '/static/' + moduleName,
                    ext: '.js',
                    extDot: 'last'
                }]
            }
        },

        dusthtml: {
            options: {
                whitespace: true
            },
            local: {
                options: {
                    context: './test/index.json'
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: ['site/**/*.dust'],
                    dest: './' + output,
                    ext: '.html',
                    extDot: 'last'
                }]
            },
            online: {
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: ['site/' + moduleName + '/**/*.dust'],
                    dest: './' + output,
                    ext: '.tpl',
                    extDot: 'last'
                }]
            }
        },

        tplbuild: {
            options: {
                layout: 'static/js/tpl/layout.dust',
                keywords: ['header', 'footer', 'main']
            },
            local: {
                options: {
                    isLocalData: true,
                    dataSrc: './test'
                },
                files: [{
                    expand: true,
                    cwd: './static',
                    src: ['**/*.dust'],
                    dest: './' + output + '/static/' + moduleName,
                    ext: '.js',
                    extDot: 'last'
                }]
            },
            online: {
                files: [{
                    expand: true,
                    cwd: './static',
                    src: ['**/*.dust'],
                    dest: './' + output + '/static/' + moduleName,
                    ext: '.js',
                    extDot: 'last'
                }]
            }
        },

        watch: {
            options: {
                livereload: true
            },
            less: {
                files: './static/**/*.less',
                tasks: ['less', 'filemap:dev', 'urlfix']
            },
            dust: {
                files: './static/**/*.dust',
                tasks: [
                    'tplbuild:local', 
                    'definewrap', 'dust', 'filemap:local', 
                    'urlfix', 'importrequiremap:local']
            },
            css: {
                files: './static/**/*.css',
                tasks: ['copy:css', 'filemap:dev', 'urlfix']
            },
            js: {
                files: './static/**/*.js',
                tasks: [
                    'copy:js', 'definewrap',
                    'filemap:dev', 'urlfix', 'importrequiremap'
                ]
            },
            html: {
                files: './static/**/*.html',
                tasks: [
                    'copy:html', 'filemap:dev', 
                    'urlfix', 'importrequiremap'
                ]
            },
            swf: {
                files: './static/**/*.swf',
                tasks: 'copy:swf'
            },
            image: {
                files: './static/**/*.{png,jpg,gif}',
                tasks: [
                    'copy:image', 'filemap:dev', 'urlfix'
                ]
            },
            tpl: {
                files: './site/**/*.{tpl,html}',
                tasks: [
                    'copy:tpl', 'filemap:dev', 
                    'urlfix', 'importrequiremap'
                ]
            },
        },

        imagemin: {
            remote: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: 'static/**/*.{png,gif,jpg}',
                    dest: './'
                }]
            }
        },

        urlfix: {
            options: {},
            prefix: {
                options: {
                    replace: 'mappath'
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: [
                        'static/**/*.{js,json,html,css}',
                        'site/**/*.{tpl,html,js,css}'
                    ],
                    dest: './' + output
                }]
            },
            all: {
                options: {},
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: [
                        'static/**/*.{js,json,html,css}',
                        'site/**/*.{tpl,html,js,css}'
                    ],
                    dest: './' + output
                }]
            }
        },

        definewrap: {
            options: {},
            dev: {
                options: {
                    csswrap: true
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: [
                        'static/' + moduleName +
                        '/js/{dt,handler}/*.js',
                        'static/' + moduleName + '/ui/**/*.js'
                    ],
                    dest: './' + output
                }]
            },
            online: {
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: [
                        'static/' + moduleName +
                        '/js/{dt,handler}/*.js',
                        'static/' + moduleName + '/ui/**/*.js'
                    ],
                    dest: './' + output
                }]
            }
        },

        filemap: {
            options: {},
            local: {
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: 'static/' + moduleName +
                        '/**/*.{html,js,css,less,jpg,png,gif}',
                    dest: './' + output
                }]
            },
            remote: {
                options: {
                    domain: remoteCdnDomain
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: 'static/' + moduleName +
                        '/**/*.{html,js,css,less,jpg,png,gif}',
                    dest: './' + output
                }]
            },
            online: {
                options: {
                    md5: true,
                    domain: cdnDomain
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: 'static/' + moduleName +
                        '/**/*.{html,js,css,less,jpg,png,gif}',
                    dest: './' + output
                }]
            }
        },

        replace: {
            tplSepRemove: {
                options: {
                    reg: {
                        '\\{\\{[^\\{\\}]*\\}\\}': ''
                    }
                },
                files: [{
                    expand: true,
                    cwd: './site',
                    src: '**/*.dust',
                    dest: './' + output + '/site/' + moduleName
                }]
            },
            tplSepFrom: {
                options: {
                    reg: {
                        '\\{\\{': '__smarty_left_sep',
                        '\\}\\}': '__smarty_right_sep',
                    }
                },
                files: [{
                    expand: true,
                    cwd: './site',
                    src: '**/*.dust',
                    dest: './' + output + '/site/' + moduleName
                }]
            },
            tplSepTo: {
                options: {
                    reg: {
                        '__smarty_left_sep': '{{',
                        '__smarty_right_sep': '}}'
                    }
                },
                files: [{
                    expand: true,
                    cwd: './'+ output,
                    src: 'site/' + moduleName + '/**/*.{tpl,html}',
                    dest: './' + output
                }]
            },
            unicode: {
                options: {
                    unicode: true
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: '**/*.{js,css}',
                    dest: './' + output
                }]
            },
            string: {
                options: {
                    reg: {
                        'http://passport.baidu.com': 'http://passport.rdtest.baidu.com',
                        'qing.baidu.com': 'qing.baidu.com:8080',
                        'zhida.baidu.com': 'zhida.baidu.com:8080',
                        'http://apps.bdimg.com/developer': remoteBaseDomain,
                        'http://developer.baidu.com': receiver.
                            replace(/(http:\/\/[^\/]+).*/, function(str, receiverDomain){
                                return receiverDomain;
                            })
                    }
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: '**/*.{tpl,html,js,css}',
                    dest: './' + output
                }]
            },
            localDs: {
                options: {
                    reg: dsConf
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: '**/*.js',
                    dest: './' + output
                }]
            }
        },

        concat: {
            options: {},
            online: {
                files: packConf
            }
        },

        devserver: {
            dev: {
                options: {
                    base: '../output',
                    port: 8888
                }
            }
        },

        importrequiremap: {
            local: {
                options: {
                    type: 'script'
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: 'site/' + moduleName + '/**/*.{tpl,html}',
                    dest: './' + output
                }]
            },
            online: {
                options: {
                    type: 'tpl'
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: 'site/' + moduleName + '/**/*.{tpl,html}',
                    dest: './' + output
                }]
            }
        },

        jsbeautifier: {
            options: {
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: true,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 3,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 80
                },
                css: {
                    fileTypes: ['.less'],
                    indentChar: " ",
                    indentSize: 4
                },
                html: {
                    fileTypes: ['.dust'],
                    braceStyle: "collapse",
                    indentChar: " ",
                    indentScripts: "keep",
                    indentSize: 4,
                    maxPreserveNewlines: 3,
                    preserveNewlines: true,
                    unformatted: ["a", "sub", "sup", "b", "i", "u"],
                    wrapLineLength: 0
                }
            },
            remote: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: [
                        'static/**/*.{js,json,html,css,less}',
                        '!static/**/{jquery,zepto,require,dust-core,dust-helpers,css}*.js',
                        'site/**/*.tpl',
                        'package.json',
                        'Gruntfile.js'
                    ]
                }]
            }
        },

        http_upload: {
            options: {
                url: receiver,
                method: 'POST'
            },
            remote: {
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: './static/**/*',
                    dest: '/home/work/webroot/static/developers/light'
                }, {
                    expand: true,
                    cwd: './' + output + '/site/',
                    src: './**/*',
                    dest: '/home/work/webroot/templates/templates/developers/light/site'
                }, {
                    expand: true,
                    cwd: './' + output + '/conf/',
                    src: moduleName + '_require_map.js',
                    dest: '/home/work/webroot/templates/templates/developers/light/conf'
                }]
            }
        },

        addtpl: {
            tpl: {
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: './site/' + moduleName + '/*.tpl'
                }]
            },
            api: {
                options: {
                    isApi: true
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: './site/' + moduleName + '/apis/*/*.tpl'
                }]
            },
            localhtml: {
                options: {
                    isLocalHtml: true
                },
                files: [{
                    expand: true,
                    cwd: './' + output
                }]
            }
        },

        uglify: {
            options: {
                mangle: {
                    except: ['require', 'module', 'exports']
                }
            },
            online: {
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: 'static/' + moduleName + '/**/*.js',
                    dest: './' + output
                }]
            }
        },

        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true,
                minifyCSS: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            },
            online: {
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: 'site/*.{tpl,html}',
                    dest: './' + output
                }]
            }
        },

        cssmin: {
            online: {
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: 'static/' + moduleName + '/**/*.css',
                    dest: './' + output
                }]
            }
        },

        rename: {
            movetooutput: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: output + '/**/*',
                    dest: '../output/' + moduleName
                }]
            },
            movehtml: {
                files: [{
                    expand: true,
                    cwd: '../output/' + moduleName + '/' + 
                        output + '/site/' + moduleName,
                    src: '**/*.html',
                    dest: '../output'
                }]
            },
            movezhida: {
                options: {
                    reg: {
                        'light_zhida\\.tpl': 'zhida_index.tpl',
                        '^light_zhida_': 'zhida_',
                        '^light_serviceprovider': 'zhida_serviceprovider'
                    }
                },
                files: [{
                    expand: true,
                    cwd: './' + output,
                    src: 'site/{light_zhida,light_serviceprovider}*.tpl',
                    dest: './' + output
                }]
            }
        }
    };

    grunt.initConfig(gruntConfig);

    var moduleDir = '../builder';
    if (!grunt.file.isDir(moduleDir)){
        moduleDir = './builder';
    }

    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-copy/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-less/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-csslint/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-watch/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-imagemin/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-jshint/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-cssmin/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-htmlmin/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-uglify/tasks');
    
    grunt.loadTasks(moduleDir + '/node_modules/grunt-dust/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-dust-html/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-jsbeautifier/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-devserver/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-http-upload/tasks');

    grunt.loadTasks(moduleDir + '/custom_modules/wow-tpl-build/tasks');
    grunt.loadTasks(moduleDir + '/custom_modules/wow-url-fix/tasks');
    grunt.loadTasks(moduleDir + '/custom_modules/wow-define-wrap/tasks');
    grunt.loadTasks(moduleDir + '/custom_modules/wow-file-map/tasks');
    grunt.loadTasks(moduleDir + '/custom_modules/wow-replace/tasks');
    grunt.loadTasks(moduleDir + '/custom_modules/wow-concat/tasks');
    grunt.loadTasks(moduleDir + '/custom_modules/wow-import-require-map/tasks');
    grunt.loadTasks(moduleDir + '/custom_modules/wow-add-tpl/tasks');
    grunt.loadTasks(moduleDir + '/custom_modules/wow-rename/tasks');

    var gruntTasks = {
        'pack': [
            'concat', 'filemap:online', 'urlfix:all', 'importrequiremap:online'
        ],
        'copytooutput': [
            'copy:image',
            'copy:swf',
            'copy:js',
            'copy:css',
            'copy:html',
            'copy:tpl',
            'copy:dust'
        ],
        'local': [
            'replace:tplSepRemove', 'dusthtml:local', 
            'copytooutput', 'less', 'csslint', 
            'replace:unicode', 'jshint:dev', 'tplbuild:local', 
            'definewrap:dev', 'dust', 'filemap:local', 'urlfix:all', 
            'replace:string', 'replace:localDs', 'importrequiremap:local', 
            'rename', 'copy:test', 'addtpl:localhtml'
        ],
        'remote': [
            // 'imagemin', 
            'replace:tplSepFrom', 'dusthtml:online', 
            'replace:tplSepTo', 'copytooutput', 'less', 
            'csslint', 'replace:unicode', 'jshint:dev', 'tplbuild:online', 
            'definewrap:dev', 'dust', 'replace:string', 'filemap:remote', 
            'urlfix:all', 'importrequiremap:online', 'jsbeautifier', 
            'addtpl', 'rename:movezhida', 'copy:custom', 'http_upload'
        ],
        'online': [
            'replace:tplSepFrom', 'dusthtml:online', 'replace:tplSepTo', 
            'copytooutput', 'less', 'csslint', 
            'jshint:online', 'tplbuild:online', 'definewrap:online', 'dust',
            'filemap:local', 'urlfix:prefix', 'pack', 
            'addtpl', 'rename:movezhida', 'copy:custom',
            'uglify', 'htmlmin', 'cssmin'
        ]
    }

    for (var task in gruntTasks) {
        grunt.registerTask(task, gruntTasks[task]);
    }
};
