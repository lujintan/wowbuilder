var path = require('path');

var gruntExecFiles = {
    jsHint: [
        'static/**/*.js',
        '!static/**/{wow,jquery,zepto,require,dust-core,dust-helpers,css}*.js'
    ]
};

module.exports = {
    getConf: function(wowInfo){
        var moduleName = wowInfo.name,
            output = wowInfo.output,
            receiver = wowInfo.receiver,
            remoteDomain = wowInfo.remote.domain || {},
            onlineDomain = wowInfo.online.domain || {};

        var remoteBaseDomain = remoteDomain.base || '',
            remoteCdnDomain = remoteDomain.cdn || '';
            cdnDomain = onlineDomain.cdn || '';

        return {
            buildstart: 'hook',
            buildend: 'hook',
            //copy files
            copy: {
                //copy files to output directory
                all: {
                    files: [{
                        expand: true,
                        cwd: './static',
                        src: [
                            '**/*.{jpg,png,gif,ico,cur,swf,js,css,html}',
                            'ui/**/*.<%= feTplExt%>'
                        ],
                        dest: './<%= output%>/static/<%= moduleName%>'
                    }, {
                        expand: true,
                        cwd: './site',
                        src: '**/*',
                        dest: './<%= output%>/site/<%= moduleName%>'
                    }]
                },
                //copy test files to output directory
                localTest: {
                    expand: true,
                    cwd: './',
                    src: 'test/**/*',
                    dest: '../output/<%= moduleName%>'
                }
            },

            //compile .less file to .css
            less: {
                all: {
                    files: [{
                        expand: true,
                        cwd: './static',
                        src: '**/*.less',
                        dest: './<%= output%>/static/<%= moduleName%>',
                        ext: '.css',
                        extDot: 'last'
                    }]
                }
            },

            //css lint
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
                        cwd: './<%= output%>',
                        src: [
                            'static/<%= moduleName%>/**/*.css',
                            '!static/**/reset.css'
                        ]
                    }]
                }
            },

            //js hint
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
                        src: gruntExecFiles.jsHint
                    }]
                },
                online: {
                    files: [{
                        expand: true,
                        cwd: './',
                        src: gruntExecFiles.jsHint
                    }]
                }
            },

            //build dust to generate html
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
                        src: ['site/**/*.<%= feTplExt%>'],
                        dest: './' + output,
                        ext: '.html',
                        extDot: 'last'
                    }]
                },
                online: {
                    files: [{
                        expand: true,
                        cwd: './' + output,
                        src: ['site/<%= moduleName%>/**/*.<%= feTplExt%>'],
                        dest: './' + output,
                        ext: '.tpl',
                        extDot: 'last'
                    }]
                }
            },

            //build tpl and generate router config
            tplbuild: {
                options: {
                    layout: 'static/js/tpl/layout.<%= feTplExt%>',
                    parentBlocks: ['header', 'nav', 'main', 'footer']
                },
                local: {
                    options: {
                        isLocalData: true,
                        dataSrc: './test'
                    },
                    files: [{
                        expand: true,
                        cwd: './static',
                        src: ['**/*.<%= feTplExt%>'],
                        dest: './<%= output%>/static/<%= moduleName%>',
                        ext: '.js',
                        extDot: 'last'
                    }]
                },
                online: {
                    files: [{
                        expand: true,
                        cwd: './static',
                        src: ['**/*.<%= feTplExt%>'],
                        dest: './<%= output%>/static/<%= moduleName%>',
                        ext: '.js',
                        extDot: 'last'
                    }]
                }
            },

            //image compression
            imagemin: {
                remote: {
                    files: [{
                        expand: true,
                        cwd: './static',
                        src: '**/*.{png,gif,jpg}',
                        dest: './<%= output%>/static/<%= moduleName%>'
                    }]
                }
            },

            //genrate
            filemap: {
                options: {},
                local: {
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: 'static/<%= moduleName%>/**/*.{html,js,css,less,jpg,png,gif}',
                        dest: './<%= output%>'
                    }]
                },
                remote: {
                    options: {
                        domain: remoteCdnDomain
                    },
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: 'static/<%= moduleName%>/**/*.{html,js,css,less,jpg,png,gif}',
                        dest: './<%= output%>'
                    }]
                },
                online: {
                    options: {
                        md5: true,
                        domain: cdnDomain
                    },
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: 'static/<%= moduleName%>/**/*.{html,js,css,less,jpg,png,gif}',
                        dest: './<%= output%>'
                    }]
                }
            },

            //dust
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

            //replace url to online or local url by filemap
            urlfix: {
                options: {},
                prefix: {
                    options: {
                        replace: 'mappath'
                    },
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: [
                            'static/**/*.{js,json,html,css}',
                            'site/**/*.{tpl,html,js,css}'
                        ],
                        dest: './<%= output%>'
                    }]
                },
                all: {
                    options: {},
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: [
                            'static/**/*.{js,json,html,css}',
                            'site/**/*.{tpl,html,js,css}'
                        ],
                        dest: './<%= output%>'
                    }]
                }
            },

            //add amd wrapper
            definewrap: {
                options: {},
                dev: {
                    options: {
                        csswrap: true
                    },
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: [
                            'static/<%= moduleName%>/js/{dt,handler}/*.js',
                            'static/<%= moduleName%>/ui/**/*.js'
                        ],
                        dest: './<%= output%>'
                    }]
                },
                online: {
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: [
                            'static/<%= moduleName%>/js/{dt,handler}/*.js',
                            'static/<%= moduleName%>/ui/**/*.js'
                        ],
                        dest: './<%= output%>'
                    }]
                }
            },

            //string replace
            replace: {
                tplSepFrom: {
                    options: {
                        reg: {
                            '\\{\\{': '__tpl_left_sep',
                            '\\}\\}': '__tpl_right_sep',
                        }
                    },
                    files: [{
                        expand: true,
                        cwd: './site',
                        src: '**/*.<%= feTplExt%>',
                        dest: './<%= output%>/site/<%= moduleName%>'
                    }]
                },
                tplSepTo: {
                    options: {
                        reg: {
                            '__tpl_left_sep': '{{',
                            '__tpl_right_sep': '}}'
                        }
                    },
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: 'site/<%= moduleName%>/**/*.{tpl,html}',
                        dest: './<%= output%>'
                    }]
                },
                allUnicode: {
                    options: {
                        unicode: true
                    },
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: '**/*.{js,css}',
                        dest: './<%= output%>'
                    }]
                },
                devString: {
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
                        cwd: './<%= output%>',
                        src: '**/*.{tpl,html,js,css}',
                        dest: './<%= output%>'
                    }]
                },
                localDs: {
                    options: {
                        reg: wowInfo.ds
                    },
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: '**/*.js',
                        dest: './<%= output%>'
                    }]
                }
            },

            //start a http server in local
            devserver: {
                dev: {
                    options: {
                        base: '../output',
                        port: 8888
                    }
                }
            },

            httpserver: {
                local: {
                    options: {
                        base: '../output',
                        port: 8888
                    }
                }
            },

            //import require config in index
            importrequiremap: {
                local: {
                    options: {
                        type: 'script'
                    },
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: 'site/<%= moduleName%>/**/*.{tpl,html}',
                        dest: './<%= output%>'
                    }]
                },
                online: {
                    options: {
                        type: 'tpl'
                    },
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: 'site/<%= moduleName%>/**/*.{tpl,html}',
                        dest: './<%= output%>'
                    }]
                }
            },

            //code beautify
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
                        fileTypes: ['.<%= feTplExt%>'],
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

            //upload file to remote server
            http_upload: {
                options: {
                    url: receiver,
                    method: 'POST'
                },
                remote: {
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: './static/**/*',
                        dest: '/home/work/webroot/static/developers/light'
                    }, {
                        expand: true,
                        cwd: './<%= output%>/site/',
                        src: './**/*',
                        dest: '/home/work/webroot/templates/templates/developers/light/site'
                    }, {
                        expand: true,
                        cwd: './<%= output%>/conf/',
                        src: '<%= moduleName%>_require_map.js',
                        dest: '/home/work/webroot/templates/templates/developers/light/conf'
                    }]
                }
            },

            //add tpl for default page
            addtpl: {
                tpl: {
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: './site/<%= moduleName%>/*.tpl'
                    }]
                },
                api: {
                    options: {
                        isApi: true
                    },
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: './site/<%= moduleName%>/apis/*/*.tpl'
                    }]
                },
                localhtml: {
                    options: {
                        isLocalHtml: true
                    },
                    files: [{
                        expand: true,
                        cwd: './<%= output%>'
                    }]
                }
            },

            //js compression
            uglify: {
                options: {
                    mangle: {
                        except: ['require', 'module', 'exports']
                    }
                },
                online: {
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: 'static/<%= moduleName%>/**/*.js',
                        dest: './<%= output%>'
                    }]
                }
            },

            //html compression
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
                        cwd: './<%= output%>',
                        src: 'site/*.{tpl,html}',
                        dest: './<%= output%>'
                    }]
                }
            },

            //css compression
            cssmin: {
                online: {
                    files: [{
                        expand: true,
                        cwd: './<%= output%>',
                        src: 'static/<%= moduleName%>/**/*.css',
                        dest: './<%= output%>'
                    }]
                }
            },

            //file rename
            rename: {
                localMove2output: {
                    files: [{
                        expand: true,
                        cwd: './',
                        src: '<%= output%>/**/*',
                        dest: '../output/<%= moduleName%>'
                    }]
                },
                localMovehtml: {
                    files: [{
                        expand: true,
                        cwd: '../output/<%= moduleName%>/<%= output%>/site/<%= moduleName%>',
                        src: '**/*.html',
                        dest: '../output'
                    }]
                }
            },

            //clean file
            clean: {
                local: {
                    files: [{
                        expand: true,
                        cwd: './',
                        src: '<%= output%>'
                    }]
                },
                server: {
                    files: [{
                        expand: true,
                        cwd: './',
                        src: '<%= output%>/**/*.{less,feTplExt}'
                    }]
                }
            }
        };
    },

    getTask: function(wowInfo){
        var gruntTasks = {
            'local': [
                //start hook
                'buildstart:local',

                // render html file 
                'compilehtml:local',
                //copy file to output directory
                'copy:all',
                //less
                'less:all', 
                //csslint
                'csslint:all',
                //replace unicode
                'replace:allUnicode',
                //jshint
                'jshint:dev',
                //build tpl and generate router config
                'tplbuild:local',
                //add amd wrap
                'definewrap:dev', 
                //compile tpl
                'compiletpl:all', 
                //generate local filemap
                'filemap:local',
                //replace url to local url by filemap
                'urlfix:all', 
                //replace url to local url
                'replace:devString', 
                //replace url local ds to wasai
                //todo enhance http server
                'replace:localDs', 
                //import require map
                'importrequiremap:local', 
                //rename to server root
                'rename:localMove2output',
                //move html to server root
                'rename:localMovehtml',
                //copy test to output
                'copy:localTest', 
                //clean output path
                'clean:local',
                //end hook
                'buildend:local'
                //addtpl
                // 'addtpl:localhtml'
            ],
            'remote': [
                'replace:tplSepFrom', 
                'dusthtml:online', 
                'replace:tplSepTo', 
                'copy:all', 
                'less:all', 
                'csslint:all', 
                'replace:unicode', 
                'jshint:dev', 
                'tplbuild:online', 
                'definewrap:dev', 
                'tpl:all', 
                'replace:string', 
                'filemap:remote', 
                'urlfix:all', 
                'importrequiremap:online', 
                'jsbeautifier', 
                'addtpl', 
                'rename:movezhida', 
                'copy:custom', 
                'clean:server',
                'http_upload'
            ],
            'online': [
                'replace:tplSepFrom', 
                'dusthtml:online', 
                'replace:tplSepTo', 
                'copy:all', 
                'less:all', 
                'csslint:all', 
                'jshint:online', 
                'tplbuild:online', 
                'definewrap:online', 
                'tpl:all',
                'filemap:local', 
                'urlfix:prefix', 
                'concat:all', 
                'filemap:online', 
                'urlfix:all', 
                'importrequiremap:online',
                'addtpl', 
                'rename:movezhida', 
                'copy:custom',
                'uglify', 
                'htmlmin', 
                'cssmin',
                'clean:server'
            ]
        };

        return gruntTasks;
    }
};