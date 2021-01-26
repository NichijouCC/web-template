# web_template
web项目基础模板 , 方便简单快速的开发web项目。

## 项目模板
启动项目
```
MyApp.start(<APP />);
```
### 1. 项目属性获取
- APP_VERSION：项目打包时间
- APP_ENV：项目环境（"prod" | "test" | "dev"）
- APP_CONFIG：项目配置
- APP_STORE: 项目数据中心

### 2.项目配置（APP_CONFIG） 管理 
项目的配置由两部分组成，一个公有配置(public->public_app_config.js),一个私有配置(src->private_app_config.json)，两者组合为最终的APP_CONFIG。

- app_config文件结构说明:
> common: 公有的项目配置  
dev:开发下的项目配置  
test:测试下的项目配置  
prod:生产下的项目配置  

- 配置优先级说明:
> 公有配置优先级 > 私有配置优先级;  
具体环境配置优先级 > 公有配置优先级;

- 配置设置方式：
> a. 在两个（公有/私有）配置文件中进行配置设置  
b. 在 src->config->init.ts 中项目配置 的类型信息. (方便在使用APP_CONFIG的时候获取类型提示)

- 内置可选规范
> a. 后端url配置  
b. 项目的目标domain

- 代码中使用配置举例
```
//1. 项目中使用配置好的配置
let api=APP_CONFIG.api;

//2. 项目中配置domain(目的：多个二级域名项目使用一级域名，解除不同域名无法共享数据和页面间跨域的问题)
//private_app_config.json
{
    domain:"xxx.com"
}
```

### 3.数据中心（APP_STORE）管理
数据中心是用于存放项目共享的数据。  
如果需要配置数据修改事件,需要自行定义（参见ctool--EventTarget）,如果需要重量组件通信,请使用redux、mobx等

- 数据中心在业务中使用：
1. 在 src-> config->mystore.ts 中设置 项目数据中心需要的数据，需要关闭再打开或刷新依旧存在的数据需要通过@att标注

2. 配置数据中心的配置项
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
3. 使用数据中心举例
```
//使用 共享的数据
let authinfo=APP_STORE.authInfo;

// 修改 共享的数据
APP_STORE.authInfo= {};
```

### 项目可选配置 - API请求配置

使用方式举例：
```
MyApp.start(<APP />, {
    onInit: () => initAxiosConfig()
});
```
可选配置：
1. 在src->services->axiosclient 配置了axios的全局配置
2. TODO: mqtt/websocket等业务封装

## 公有组件与样例
1. CheckTokenRoute (跳转路由,验证token),使用样例见：examples->privateRoute_1
2. LazyComp (懒加载组件), 使用样例见：examples->lazyComp_1、examples->lazyComp_2
3. examples->router_1：演示路由集中配置(包含多级路由)
4. TODO: echarts样例

## 项目-webapck特性
1. ts/js支持
2. 自动判断是否添加cesium的webpack配置
3. 根据指令从不同入口文件启动项目

## 项目-指令：
1. ``yarn start``启动项目
2. ``yarn choose [xx]`` 启动以【xx】开头且位于src文件夹下文件，作为入口文件启动项目
3. ``yarn build``项目打包(生产环境)，``yarn build:test``项目打包(测试环境)
4. ``build:analyze`` 项目打包分析

## 项目工程特性：
1. web项目的docker部署配置文件
2. 本地调试工具：本地nginx 容器服务（https,http）
3. .vscode->launch.json 配置浏览器以关闭安全策略启动
4. eslint 检查代码
5. TODO: CICD


## 注意：
1. 本地调试优先使用[SwitchHosts](https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=02003390_hao_pg&wd=SwitchHosts&oq=SwitchHosts), nginx次之