# web_template 🔥🔥🔥
web项目基础模板 , 方便简单快速的开发web项目。

项目文件目录介绍：
```
- config                        # webapck配置管理目录                   (必选，固定目录，可按需增加webpack配置)
- public                        # 项目公共资源目录                       (必选，固定目录,按需添加额外资源)
-- index.html                   # 项目html文件                          (必选，固定文件)
-- public_app_config.js         # 项目公共配置文件                       (必选，固定文件)
- src                           # 项目源码目录                           (固定目录)
-- __internal                   # 项目框架源码目录                       (必选，固定目录)
-- comps                        # 项目公共组件目录                       (可选，推荐目录)
-- config                       # 项目（app_store和app_config）自定义配置目录    (必选，固定目录)
-- examples                     # 公共组件演示和功能演示样例目录          (不需要)
-- pages                        # 项目分页管理目录                       (可选，推荐目录)
-- services                     # 和后端通信配置管理目录                  (可选，推荐目录)
-- index.tsx                    # 项目启动文件                           (必选，固定文件)
-- private_app_config.json      # 项目私有配置文件                       (必选，固定文件)
```

项目依赖:👩‍💻👩‍💻👩‍💻
```
    - "webpack": "^4.41.2"
    - "typescript": "^3.7.2",
    - "react": "^16.12.0"
    - "react-router-dom": "^5.2.0",
```

项目提供:💁💁💁
```
    1. 可配置环境，提供不同优先级的环境配置
    2. 全局共享的数据中心
    3. 可选的API请求配置
    4. 内置公共组件库：私有路由、懒加载组件等
```

项目-webapck特性:🎉🎉🎉
```
    1. 泛含义上的特性（less支持、压缩、分块等）
    2. ts/js支持
    3. 自动判断是否添加cesium的webpack配置
    4. 根据指令从不同入口文件启动项目
```

项目工程特性:✨✨✨
```
    1. web项目的docker部署配置文件
    2. 本地调试工具：本地nginx 容器服务（https,http）
    3. .vscode->launch.json 配置浏览器以关闭安全策略启动
    4. eslint 检查代码
    5. TODO: CICD
```


## 安装&启动 🚀🚀🚀 Installation
安装:🔎🔎🔎
```
yarn 
```

项目-指令:👉👉👉
```
    1. ``yarn start`` 启动项目（开发环境）
    2. ``yarn build`` 项目打包(生产环境)，``yarn build:test``项目打包(测试环境)
    3. ``build:analyze`` 项目打包分析
    4. ``yarn choose [xx]`` 启动以【xx】开头且位于src文件夹下文件，作为入口文件启动项目
```

## 注意：💢💢💢
1. 本地调试优先使用[SwitchHosts](https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=02003390_hao_pg&wd=SwitchHosts&oq=SwitchHosts), nginx次之



## 核心入口 💖💖💖 The Core 

React原入口
``ReactDOM.render(root, document.getElementById("root"));`` 
对应如下：

```
MyApp.start(<APP />,{
    //（可选） 设置当前项目环境,覆盖掉默认环境配置 
    app_env:"prod";
    //（可选） 配置数据中心，详情见下面 3.数据中心（APP_STORE）管理
    storeOpt:{}
    //（可选） 启动的时候干些事情
    onInit: () => {};
    ...
});
```

全局属性获取：
```
    - APP_VERSION： 项目版本信息
    - APP_ENV：     项目环境（"prod" | "test" | "dev"）
    - APP_CONFIG：  项目配置
    - APP_STORE:    项目数据中心
```



## 文档 📓📓📓 Documentation
### 1.项目配置（APP_CONFIG） 管理 ⚙⚙⚙
    项目的配置组成：a.(可选)公有配置(public->public_app_config.js),b.(可选)私有配置(src->private_app_config.json)，c. (可选)Myapp.start 的启动参数 app_config，组合为最终的APP_CONFIG。

- 公/私有配置文件固定结构说明:
```
    common:   各环境common配置  
    dev:      开发下的项目配置  
    test:     测试下的项目配置  
    prod:     生产下的项目配置  
```

- 配置优先级说明:
```
    私有配置common < 公有配置common < 私有配置具体环境 < 公有配置具体环境 < Myapp.start 的启动参数 app_config;
```

- 配置设置方式：
```
    a. 在可配置处进行配置设置  
    b. 在 src->config->customeConfig.ts 中设置项目配置 的类型信息. (方便在使用APP_CONFIG的时候获取类型提示，默认：any)
```

- 代码中使用配置举例
```
    let api=APP_CONFIG.api;
```

### 2.数据中心（APP_STORE）管理
    APP_STORE是用于存放项目共享数据的数据中心和管理项目事件的通信中心。  
    （如果不习惯提供的事件管理功能,请配合使用redux、mobx等）

- 数据中心在业务中使用：
1. 在 src-> config->customeStore.ts 中设置 项目数据中心需要的数据，需要关闭再打开或刷新依旧存在的数据需要通过@att标注
2. 在 src-> config->customeStore.ts 中定义 项目需要的通信事件(方便在使用APP_STORE.on和.emit的时候获取类型提示，默认：any)，
3. 设置数据中心的配置项
```
    MyApp.start(<APP />, {
        //store配置项（可选）
        storeOpt:{
            // 是否将数据存入Storage(可选："localStorage"、"sessionstorage"、"none")，默认：“none”
            saveItemToStorage: "localStorage";
            // 启动的时候加载上次的数据，默认：true
            loadDataOnOpen: false;
        },
        //（可选）数据中心数据。配置这个会覆盖掉MyStore标注的数据中心
        store_data：{}
    });
```
- 使用数据中心举例
```
    //使用 共享的数据
    let authinfo=APP_STORE.authInfo;

    // 修改 共享的数据
    APP_STORE.authInfo= {};

    // 数据中心数据 某属性更改事件监听
    APP_STORE.on("xxatt",(newValue,oldValue)=>{

    });
    // 任意数据中心 属性数据修改事件监听
    APP_STORE.on("attChange",(att,newValue,oldValue)=>{

    });


    // 业务事件管理举例：触发登录事件
    APP_STORE.emit("login",{name:"xx"});
    // 业务事件管理举例：监听登录事件
    APP_STORE.on("login",(ev:{name:string})=>{
        //xx
    });
```

### 3.项目可选配置

使用方式举例：
```
    MyApp.start(<APP />, {
        onInit: () => initAxiosConfig()
    });
```
可选配置：
```
    1. 在src->services->axiosclient 配置了axios的全局配置
    2. TODO: mqtt/websocket等业务封装
```
### 4.公有组件与样例
```
    1. CheckTokenRoute (跳转路由,验证token),使用样例见：examples->privateRoute_1
    2. LazyComp (懒加载组件), 使用样例见：examples->lazyComp_1、examples->lazyComp_2
    3. examples->router_1：演示路由集中配置(包含多级路由)
    4. TODO: echarts样例
```













