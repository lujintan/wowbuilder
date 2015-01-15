wowbuilder
==========

## 安装

```bash
$ npm install -g wowbuilder
```

##使用指南

###第一步，根据wowstyleguide搭建基础的模块架构文件，配置package.json文件

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

* 运行wow 命令名，命令名为package.json 中配置的命令

###第三步，启动本地server测试

```bash
$ wow server
```
    
* server为node server，默认监听本地8888端口

## package.json说明

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
