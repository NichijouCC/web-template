# web_template
web项目基础模板 , 方便简单快速的开发web项目。

## 项目模板
启动项目
对应``ReactDOM.render(root, document.getElementById("root"));``
```
MyApp.start(<APP />,{
    //（可选） 设置当前项目环境,覆盖掉默认环境配置 
    app_env:"prod";
    // (可选)
    app_config:{};
    //（可选） 配置数据中心，详情见下面 3.数据中心（APP_STORE）管理
    storeOpt:{}
    //（可选） 启动的时候干些事情
    onInit: () => {};
    ....
});
```
### 1. 固定结构介绍
```
 - config                                  #webapck配置文件目录
 - pulic                                   #项目pulic目录(固定目录,已有文件为每项目必须。按需放入其他文件)
 -- index.html                             #项目html文件 (固定文件)
 -- public_app_config.js                   #项目公有配置文件(固定文件)
 - src                                     #项目源码根目录
 -- __internal                             #项目模板封装源码部分.（固定目录,已有文件为每项目必须。一般不需要改动）
 -- comps                                  #公共react组件 (可选)
 -- config                                 #项目的自定义配置文件夹 (固定目录,已有文件为每项目必须。按照项目要求进行配置)
 -- examples                               #组件使用或者功能演示样例文件夹 (实际项目不需要这个)
 -- pages                                  #项目分页管理，各page集合文件夹 (可选组织方式,推荐)
 -- services                               #项目和后端交互的配置管理(可选配置项，推荐)
 -- index.tsx                              #项目启动文件 (固定文件)
 -- private_app_config.json                #私有配置文件 (固定文件)
```

### 2. 全局属性介绍
- APP_VERSION：项目版本信息
- APP_ENV：项目环境（"prod" | "test" | "dev"）
- APP_CONFIG：项目配置
- APP_STORE: 项目数据中心

### 3.项目配置（APP_CONFIG） 管理 
项目的配置组成：
1. 公有配置(public->public_app_config.js)
2. 私有配置(src->private_app_config.json)
3. MyApp启动app_config属性

- 公有配置/私有配置 固定结构说明:
```
common:   #各环境common配置  
dev:      #开发下的项目配置  
test:     #测试下的项目配置  
prod:     #生产下的项目配置  
```
- 配置优先级说明:
> 公有配置优先级 > 私有配置优先级;
具体环境配置优先级 > 各环境common配置优先级;

私有配置common < 公有配置common < 私有配置具体环境 < 公有配置具体环境 < MyApp启动app_config属性

- 配置设置方式：
> a. 在两个（公有/私有）配置文件中进行配置设置  
b. 在 src->config->customeConfig.ts 中设置项目配置 的类型信息. (方便在使用APP_CONFIG的时候获取类型提示，不然为默认类型：any)

- 代码中使用配置举例
```
let api=APP_CONFIG.api;
```

### 4.数据中心（APP_STORE）管理

数据中心的用途：1.存放项目共享的数据; 2.管理项目的事件中心。

#### 4.1数据中心在业务中使用：
1. 在 src-> config->customeStore.ts 中设置 项目数据中心需要的数据，需要关闭再打开或刷新依旧存在的数据需要通过@att标注
2. 在 src-> config->customeStore.ts 中定义 需要的项目事件类型. (方便在使用APP_STORE.on和.emit的时候获取类型提示，不然为默认类型：any)

#### 4.2 设置数据中心的配置项
```
MyApp.start(<APP />, {
    //store配置项（可选）
    storeOpt:{
        // 是否将数据存入Storage(可选："localStorage"、"sessionstorage"、"none")，默认：“none”
        saveItemToStorage: "localStorage";
        // 启动的时候加载上次的数据，默认：true
        loadDataOnOpen: false;
    }
});
```
#### 4.3 使用数据中心举例
```
//使用 共享的数据
let authinfo=APP_STORE.authInfo;

// 修改 共享的数据
APP_STORE.authInfo= {};

// 触发事件
APP_STORE.emit("login",authInfo)
// 监听事件
APP_STORE.on("login",(authInfo)=>{
    //xx
})
```

## 项目可选配置 
提供各种可供选择的额外配置，按需使用。包含：
1. 在src->services->axiosclient 配置了axios的全局配置
2. TODO: mqtt/websocket等业务封装


### 可选配置-API请求配置

使用方式举例：
```
MyApp.start(<APP />, {
    onInit: () => initAxiosConfig()
});
```

## 公有组件与样例
1. CheckTokenRoute (跳转路由,验证token),使用样例见：examples->privateRoute_1
2. LazyComp (懒加载组件), 使用样例见：examples->lazyComp_1、examples->lazyComp_2
3. examples->router_1：演示路由集中配置(包含多级路由)
4. TODO: echarts样例

## 项目-webapck特性
1. 泛含义上的特性（less支持、压缩、分块等）
2. ts/js支持
3. 自动判断是否添加cesium的webpack配置
4. 根据指令从不同入口文件启动项目

## 项目-指令：
1. ``yarn start``启动项目（开发环境）
2. ``yarn build``项目打包(生产环境)，``yarn build:test``项目打包(测试环境)
3. ``build:analyze`` 项目打包分析
4. ``yarn choose [xx]`` 启动以【xx】开头且位于src文件夹下文件，作为入口文件启动项目

## 项目工程特性：
1. web项目的docker部署配置文件
2. 本地调试工具：本地nginx 容器服务（https,http）
3. .vscode->launch.json 配置浏览器以关闭安全策略启动
4. eslint 检查代码
5. TODO: CICD


## 注意：
1. 本地调试优先使用[SwitchHosts](https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=02003390_hao_pg&wd=SwitchHosts&oq=SwitchHosts), nginx次之