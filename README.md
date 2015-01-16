wowbuilder
==========

##关于wowbuilder

### wow单页系统简介
wow单页系统可以帮助开发者快速搭建一套前端单页面应用，wow框架主要包含：

* wowspg — 前端Javascript单页面框架，单页面应用前端基础库
* wowui — 前端基础样式库
* [wowbuilder](https://github.com/cloud-fe/wowbuilder) — 单页面框架自动化编译工具，前端人员可以按照传统方式进行开发，由wowbuilder编译成为单页面，同时支持打包、压缩、本地测试等前端开发相关工具
* [wowstyleguide](https://github.com/cloud-fe/wowstyleguide) — wow框架代码开发规范

### wowbuiler概述
wowbuilder作为wow系统的前端自动化工具，帮助开发者完成单页应用搭建、自动化编译打包、本地测试等功能。wowbuilder源码基于node编写，运行在装有node的运行环境中。

## 安装

```bash
$ npm install -g wowbuilder
```

##使用指南

###第一步，根据[wowstyleguide](https://github.com/cloud-fe/wowstyleguide)搭建基础的模块架构文件，配置package.json文件

```javascript
{
    "name": "xxx",
    "description": "xxx模块代码",
    "version": "1.0.1",
    "url": "http://xxx.com",
    "author": [{
        "name": "yingxuetan",
        "mail": "yingxuetan@163.com"
    }],
    "wow": {    //wowbuiler编译相关配置
        "name": "xxx",  //模块名
        "path": "xxx",  //模块在项目中得部署路径
        "tasks": {
            "online": {     //线上代码配置
                "wow-urlmap": {
                    "options": {    //配置线上静态文件基础路径
                        "basePath": "http://apps.bdimg.com/developer/static/1/zhida/static"
                    }
                }
            },
            "local": {      //本地测试是配置
                "wow-urlmap": {
                    "options": {
                        "mapOption": "local"
                    }
                },
                "jshint": {     //覆盖jshint默认配置
                    "options": {
                        "debug": true
                    }
                },
                "wow-md5": false,   //关闭静态文件md5重命名功能
                "uglify": false,    //关闭js文件压缩功能
                "cssmin": false,    //关闭css压缩功能
                "htmlmin": false,   //关闭html压缩功能
                "localserver": true,    //在本地server中部署
                "wow-pack": false       //关闭打包功能
            },
            "remote": {     //远程服务器测试配置
                "wow-urlmap": {     //远程服务器静态文件路径配置
                    "options": {
                        "basePath": "http://xx.com/static/1/zhida/static"
                    }
                },
                "wow-httpupload": {     //文件上传到远程服务器配置
                    "options": {
                        "url": "http://xxx.com/wow_receiver.php",   //文件接收器
                        "method": "POST"
                    },
                    "files": [{
                        "expand": true,
                        "cwd": "./<%=dist%>/build",
                        "src": "./static/**/*",
                        "dest": "/home/usr/webroot/static/xxx"
                    }]
                }
            }
        },
        "router": {     //路由配置
            "/service": "service/src/dust/index.dust"
        },
        "rewrite": {    //本次测试数据rewrite规则
            "/aaa/bbb/data": "xxx/test/index.json"
        }
    }
}
```

###第二步，执行wow命令

```bash
$ wow local
$ wow remote
$ wow online
```

* 运行wow + 命令名，命令名为package.json 中配置的命令

###第三步，启动本地server测试

```bash
$ wow server
```
    
* server为node server，默认监听本地8888端口

## package.json说明

<table>
    <tr>
        <td>关键字</td><td>含义</td>
    </tr>
    <tr>
        <td>name</td><td>模块名</td>
    </tr>
    <tr>
        <td>path</td><td>部署路径，默认与name同名</td>
    </tr>
    <tr>
        <td>deps</td><td>依赖的模块</td>
    </tr>
    <tr>
        <td>pack</td><td>打包配置</td>
    </tr>
    <tr>
        <td>tasks</td><td>任务配置</td>
    </tr>
    <tr>
        <td>router</td><td>路由正则到模板的映射</td>
    </tr>
    <tr>
        <td>entrance</td><td>入口文件</td>
    </tr>
    <tr>
        <td>rewrite</td><td>本地测试的rewrite规则</td>
    </tr>
</table>

## 前端模板编译语法说明

<table>
    <tr>
        <td>关键字</td><td>含义</td><td>属性</td>
    </tr>
    <tr>
        <td>block</td><td>页面片段的定义</td><td>name: block 名字<br>tag: block最外层标签<br>sync: 是否为同步模板</td>
    </tr>
    <tr>
        <td>extend</td><td>模板继承</td><td>file: 父级模板path</td>
    </tr>
    <tr>
        <td>title</td><td>页面标题</td><td>name: 页面标题内容</td>
    </tr>
    <tr>
        <td>spgmain</td><td>单页面配置导入位置</td><td>var: 单页配置导入到的变量名称</td>
    </tr>
</table>

block标签内部，标签使用说明：
<table>
    <tr>
        <td>标签名</td><td>含义</td><td>属性</td>
    </tr>
    <tr>
        <td>datasource</td><td>block数据源</td><td>href: 数据源url</td>
    </tr>
    <tr>
        <td>link</td><td>样式表，可直接使用.less</td><td>href: 样式表path</td>
    </tr>
    <tr>
        <td>script</td><td>页面脚本文件</td><td>src: 脚本path<br>handler: dt|start|ready|usable 表示处理器的类型</td>
    </tr>
</table>

例：

配置文件的router配置：

```javascript
"router": {
    "/aaa": "aaa/src/dust/index.dust"
}
```

模板文件：

```javascript
    //layout.dust文件
    //outer表示，父级模板不在当前模板
    {%extend name="outer"%}
    {%block name="main"%}
        {%block name="service-main" class="m-service-index-wp yh"%}{%/block%}
    {%/block%}
    
    //index.dust文件
    {%extend file="aaa/src/dust/layout.dust"%}
    {%block name="aaa-main" class="m-aaa-index-wp"%}
        <datasource href="/aaa/bbb/data">
        <link rel="stylesheet" type="text/css" href="aaa/src/less/index.less">
        <script type="text/javascript" src="aaa/src/js/handler/index.js"></script>
    {%/block%}
```

编译后产出配置文件：

```javascript
define(function () {
    return {
        "block": {
            "main": {
                "block": {
                    "aaa-main": {
                        "tpl": "",
                        "sync": "no",
                        "handler": {},
                        "selector": "#wowBlockaaa-main1"
                    }
                },
                "tpl": "aaa/src/dust/wow_block_layout_main2",
                "sync": "no",
                "handler": {}
            }
        },
        "router": {
            "/aaa": {
                "block": {
                    "aaa-main": {
                        "tpl": "aaa/src/dust/wow_block_index_service-main0",
                        "css": ["aaa/src/less/index"],
                        "ds": "/static/1/community/light/config/service_index.json",
                        "sync": "no",
                        "handler": {
                            "ready": ["aaa/src/js/handler/index"]
                        }
                    }
                }
            }
        }
    };
});
```
## 目前集成的功能列表

<table>
    <tr>
        <td>名称</td><td>说明</td>
    </tr>
    <tr>
        <td>clean</td><td>文件清除</td>
    </tr>
    <tr>
        <td>copy</td><td>文件复制</td>
    </tr>
    <tr>
        <td>less</td><td>less文件编译</td>
    </tr>
    <tr>
        <td>csslint</td><td>css错误检测</td>
    </tr>
    <tr>
        <td>jshint</td><td>js错误检测</td>
    </tr>
    <tr>
        <td>dust</td><td>dust模板编译</td>
    </tr>
    <tr>
        <td>string-replace</td><td>文件字符串替换</td>
    </tr>
    <tr>
        <td>uglify</td><td>js代码压缩</td>
    </tr>
    <tr>
        <td>cssmin</td><td>css代码压缩</td>
    </tr>
    <tr>
        <td>htmlmin</td><td>html代码压缩</td>
    </tr>
    <tr>
        <td>imagemin</td><td>图片文件压缩</td>
    </tr>
    <tr>
        <td>beautify</td><td>代码美化工具</td>
    </tr>
    <tr>
        <td>watch</td><td>文件修改监听</td>
    </tr>
    <tr>
        <td>wow-spg</td><td>将单页面模板文件编译成wowspg配置文件</td>
    </tr>
    <tr>
        <td>wow-wrap</td><td>对commonjs规范书写的文件进行amd包裹</td>
    </tr>
    <tr>
        <td>wow-urlfix</td><td>前端静态文件引入路径替换</td>
    </tr>
    <tr>
        <td>wow-urlmap</td><td>生成线下文件路径到线上静态文件路径得映射</td>
    </tr>
    <tr>
        <td>wow-pack</td><td>处理文件的打包配置</td>
    </tr>
    <tr>
        <td>wow-requiremap</td><td>生成amd的id映射</td>
    </tr>
    <tr>
        <td>wow-addrequiremap</td><td>将requiremap添加到模板文件</td>
    </tr>
    <tr>
        <td>wow-httpupload</td><td>进行代码文件的上传</td>
    </tr>
    <tr>
        <td>wow-httpserver</td><td>开启本地node http server</td>
    </tr>
</table>
