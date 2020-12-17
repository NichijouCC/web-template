## webapck

### 特性
1. ts/js支持
2. console log项目最新打包时间
3. 自动判断是否添加cesium的webpack配置
4. 动态入口文件启动项目

### 指令：
1. ``yarn start``启动项目
2. ``yarn choose [xx]`` 启动以【xx】开头且位于src文件夹下文件，作为入口文件启动项目
3. ``yarn build``项目打包
4. ``build:analyze`` 项目打包分析

## 工程特性：
1. web docker部署配置文件
2. 本地调试工具：本地nginx 容器服务（https,http）
3. .vscode->launch.json 配置浏览器以关闭安全策略启动
4. eslint 检查代码

## 注意：
1. 本地调试优先使用[SwitchHosts](https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=02003390_hao_pg&wd=SwitchHosts&oq=SwitchHosts), nginx次之