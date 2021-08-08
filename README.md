# web_template 🔥🔥🔥
基于 REACT+WEBPACK+TYPESCRIPT 实现的web脚手架,目的是通过提供一系列通用工具并集合项目开发各环节的最佳实践，方便简单快速的开发web项目。  

浅框架提供:
- 基础的webpack配置
- 多入口项目配置(类似env)
- 数据中心(状态管理&事件通信中心)
- 内置常用公用react组件
- 可选拓展配置(axios等)
- 常规需求功能样例集

## 核心功能
### 1.浅框架- 启动
React原入口
``ReactDOM.render(root, document.getElementById("root"));`` 
对应启动入口如下：
```
MyApp.start(<APP />,{
    //（可选） 设置当前项目环境，覆盖默认环境（Tip: app_config跟着环境走）
    appEnv:"prod";
    //（可选） 配置数据中心，详情见下面 2.数据中心（APP_STORE）管理
    storeData:{}
    storeOpt:{}
    //（可选） 启动的时候干些事情
    onInit: () => {};
    //（可选）改写domain
    appDomain:"xx"
});
```

提供全局变量：
```
    - APP_VERSION： 项目版本信息
    - NODE_ENV:     NODE环境("development"|"production"),默认："production"
    - APP_ENV：     项目环境（"prod" | "test" | "dev"）,默认："prod"
    - APP_CONFIG：  项目配置
    - APP_STORE:    项目数据中心
```

### 2.浅框架-项目配置（APP_CONFIG） 管理 ⚙⚙⚙
    ``MyApp.start`` 的时候内部会先判断当前的app_env,根据app_env读取配置文件中的配置作为app_config。项目的配置有多个配置入口的. 
配置入口如下：
>  a.(可选)公有配置(public->public.config.js)  
>  b.(可选)私有配置(src->private.config.json)  
>  c.(可选)Myapp.start 的启动参数 app_config

配置优先级：  
>多环境配置： 私有配置common  < 私有配置具体环境 < 公有配置common< 公有配置具体环境 < Myapp.start 的启动参数 app_config

公/私有配置文件固定结构:
```
    common:   各环境common配置  
    xx:      xx环境下的项目配置
```

### 3.浅框架-数据中心（APP_STORE）管理
APP_STORE提供功能包含:a. 全局共享数据管理 b.事件通信中心 c.数据存储 d.同源界面共享store。基于以上衍生的功能：状态管理(类似redux，mobx)  

- 数据中心在业务中使用：
> 1. 在 src-> config->customStore.ts 中设置 项目数据中心需要的数据，需要关闭再打开或刷新依旧存在的数据需要通过@att标注
> 2. 在 src-> config->customStore.ts 中定义 项目需要的通信事件(方便在使用APP_STORE.on和.emit的时候获取类型提示，默认：any)，
> 3. 数据中心初始化配置项： ``MyApp.start 启动参数中的 storeOpt 和 store_data``

Tip:
1. 需要被存储的数据需要用@att标记

- 功能使用情景演示举例
1. 作为共享数据中心
```
    let authinfo=APP_STORE.authInfo;//使用 共享的数据
    APP_STORE.authInfo= {};//修改 共享的数据
    APP_STORE.on("xxatt",(newValue,oldValue)=>{});// 数据中心属性数据事件监听
    APP_STORE.on("attChange",(att,newValue,oldValue)=>{}); // 数据中心任意属性数据修改事件监听
```
2. 作为事件通信中心
```
    APP_STORE.on("login",(msg)=>{console.log(msg)})//事件监听
    APP_STORE.emit("login","我登录了")//事件监听
```

3. 数据存储
    @Serialize标记需要持久化的数据（serialize的数据本身也是多页面共享的）；
    @Share 标记需要通过多页面共享的数据
    未标记的数据是单页面的共享变量，不会多页面共享，也不会持久化。适合不能多页面共享的变量例如websocket client，或者不想多页面共享需要每个页面独一份的变量
    loadDataOnOpen默认true,即会将存储的数据（@Serialize标记的数据）在启动的时候赋值给store；

```
    MyApp.start(<APP />, {
        //store配置项（可选）
        storeOpt:{
            // 目标对象;如果为null,即为@MyStore 标记的对象
            target?: T;
            //store初始化值;
            initData?: Partial<T>;
            // 启动的时候加载上次的数据，默认：true
            loadDataOnOpen: false;
        },
    });
```
4. 作为状态管理器
```
    //class组件使用提供的帮助函数 mapAppStoreToProps
    @mapAppStoreToProps(["xxAtt"])
    export class ClassComp2 extends React.Component<{ xxAtt?: any }> {
        render() {
            return <div>【ClassComp2】xxAtt:{this.props.xxAtt}</div>
        }
    }
    //function组件使用提供的帮助函数 useAppStore
    export function FuncComp2() {
        let storeAtt = useAppStore("xxAA");
        return <div>【FuncComp2】xxAA:{storeAtt}</div>
    }
```
5. 不使用@MyStore
```
    class XXStore {
        myAtt: string;
    }
    MyApp.start(<APP />, {
        storeOpt: {
            target: new XXStore()
        }
    });
```


### 4.可选拓展配置
    在 ``src/extends``提供各种配置，在具体项目开发的时候可以按需引入。不需要的拓展可在一开始移除对应依赖包
已有可选配置列表：
> 1. extends/axios 配置了axios的全局配置以及修改了类型提示。 第三方依赖：axios
> 2. TODO: mqtt/websocket等业务封装

可选配置使用举例：
```
    MyApp.start(<APP />, {
        onInit: () => {
            initAxiosConfig()//使用 extends/axios 提供的配置
        }
    });
```

### 5.公有组件与样例
> 1. PrivateRoute (跳转路由,验证token),使用样例见：examples->privateRoute_1
> 2. LazyComp (懒加载组件), 使用样例见：examples->lazyComp_1、examples->lazyComp_2
> 3. examples->router_1：【业务向】演示路由集中配置(包含多级路由)
> 4. examples->appStore：【TEMPLATE】演示APP_STORE帮助函数的使用(class组件与function组件)
> 5. examples->appStore_2：【业务向】共享确认对话框（配合app_store）
> 6. examples->lazyComp_1：【公共组件】演示lazyComp基本使用
> 7. examples->lazyComp_2：【业务向】演示lazyComp配合路由做页面bundle分割
> 8. examples->privateRoute_1：【公共组件】演示privateRoute做界面权限检查跳转
> 9. examples->router_2：【公共组件】演示侧边路由组件（MenuForRoute、RouteForMenu）
> 10. examples->router_3：【业务向】演示侧边路由组件配合RBAC做界面权限控制
> 11. examples->permissionComp_1：【公共组件】演示各种情景下的权限控制组件

## 本项目快速使用流程
    1.项目初始化。
        1. 从git拉取本项目后,切换git源为自己的项目git地址。
        2. 修改package.json中项目信息。
        3. 清理掉不需要的目录、文件和第三方依赖包，即可执行 ``yarn`` 完成项目初始化.
    2. 项目开发准备
        1. 根据项目情况，可选择合理的 APP_CONFIG配置方式，配置项目需要的 API地址等信息
        2. 在 ``src/config/customConfig.ts`` 中配置APP_CONFIG的类型信息
        3. 在 ``src/config/customStore.ts`` 中配置APP_STORE 需要的全局数据和需要的事件类型
        4. 修改``MyApp.start`` 启动项
### 1. 项目搭建 - 包依赖
包依赖:
```
    - "@mtgoo/ctool": "^0.0.16",// nodejs公共方法库，本框架依赖里面部分方法，项目开发中也可以按需引入
    - "axios": "^0.21.0",       // 可选配置【src/extends/axios】 依赖的包
    - "react": "^16.12.0",
    - "react-dom": "^16.12.0",
    - "react-router-dom": "^5.2.0",//路由样例 依赖的包
```

### 2. 项目搭建 - 项目结构

文件目录介绍：
```
├─ config                              # webpack配置管理目录                   (必选，固定目录，可按需增加webpack配置)
├─ public                              # 项目公共资源目录                       (必选，固定目录,按需添加额外资源)
|       ├─public_app_config.js         # 项目公共配置文件                       (必选，固定文件)
├─ src                                 # 项目源码目录                           (固定目录)
|       ├─__internal                   # 项目框架源码目录                       (必选，固定目录)
|       ├─comps                        # 项目公共组件目录                       (可选，推荐目录)
|       ├─config                       # 项目（app_store和app_config）自定义配置目录    (必选，固定目录)
|              ├─myAppConfig.ts        # 自定义app_config的类型(获得提示)        (可选,推荐)
|              ├─myProjectConfig.ts    # 自定义project_config                   (可选，用于隐藏不需要暴露的配置)
|              ├─myStore.ts            # 自定义store数据和事件类型               (可选，推荐)
|              ├─types.ts              # 拓展internal层的类型                   (可选，推荐)
|       ├─examples                     # 公共组件演示和功能演示样例目录          (不需要)
|       ├─pages                        # 项目分页管理目录                       (可选，推荐目录)
|       ├─app.tsx                      # 界面开始组件                           (可选，推荐文件)
|       ├─extends                      # 可选拓展配置管理目录                   (可选，推荐目录)
|       ├─index.html                   # 项目html文件                          (必选，固定文件)
|       ├─index.tsx                    # 项目启动文件                           (必选，固定文件)
├─ .eslintrc.js                        # eslint配置文件                         (可选，推荐)
├─ babel.config.js                     # babel配置文件                          (必选)
├─ docker-compose.yml                  # docker-compose文件                     (可选，推荐)
├─ Dockerfile                          # docker文件                             (可选，推荐)
```

### 3. 项目搭建 - webpack配置
webpack配置基于公用和具体环境分开配置,设置上尽量精简。  

webpack配置目标：
> 1. 泛含义上的特性（less支持、压缩、分块等）
> 2. ts/js支持
> 3. 自动判断是否添加cesium的webpack配置
> 4. 根据指令从不同入口文件启动项目
> 5. 使用tsconfig中的 paths 配置
> 6. 配合框架保存APP_ENV/NODE_ENV/APP_VERSION等

配置位于 ``config`` 文件夹下：
```
├─ config
|       ├─config.js                 #每个项目常规根据需要修改webpack配置的文件。包含：开发端口等
|       ├─helper.js                 #提供各种帮助函数，方便修改webpack配置
|       ├─run.js                    #执行webpack指令文件
|       ├─webpack.base.js           #webpack基础配置文件
|       ├─webpack.dev.js            #webpack开发配置
|       ├─webpack.prod.js           #webpack生产配置
```
指令:👉👉👉
- ``yarn start`` 启动项目（开发环境）
- ``yarn build`` 项目打包(生产环境)，
- ``yarn build:test``项目打包(测试环境)
- ``build:analyze`` 项目打包分析
- ``yarn example [xx]`` 启动以【xx】开头且位于src/examples文件夹下的样例

### 4. 项目开发
提供的APP_STORE、公共组件、可选拓展等玩具可好好玩耍.😀

### 5. 项目DEBUG
vscode、chrome 提供了断点/log等充足的Debug工具 ，但有时还是需要配合其他工具完成debug。  

DEBUG需求情景如下：
> 1. 需要使用域名访问本地项目。工具： [SwitchHosts](https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=02003390_hao_pg&wd=SwitchHosts&oq=SwitchHosts)
> 2. 如果api和web域名相同，SwitchHosts没法完成，只能上 nginx (在___debug_nginx 文件夹下配置了一些基础nginx配置)
> 3. 浏览器报跨域，后端不方便修改，可使用.vscode/launch.json -> runtimeArgs 配置已非安全模式启动chrome。

### 6. 项目部署
项目使用docker部署，docker配置文件包括(``docker-compose.yml``,``Dockerfile``)，在具体项目开发是可按需修改 ``docker-compose.yml ``配置外部端口和``networks``
//TODO：CICD

![](https://note.youdao.com/yws/public/resource/4e0e610896b6c99a93c33ec3d0ed6b78/xmlnote/DDBF2E299689486D97F09CA5DEA65B12/16226)
