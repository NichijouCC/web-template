import React, { useEffect, useState } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

/**
 * 路由验证token，跳转登录页面
 * @param props.component 目标组件，即route.component 参数
 * @param props.rest route需要各种参数&目标组件需要各种参数
 */
export function PrivateRoute<T extends RouteProps = RouteProps, P = {}>(props: P & T & { component: React.ElementType<P> }) {
    let PrivateRouteComp = MyRoute as any;
    let { component, ...rest } = props;
    return <Route {...rest} render={() => {
        return (<PrivateRouteComp {...props} />)
    }} />
}

function MyRoute<T extends RouteProps = RouteProps, P = {}>({ component, ...rest }: P & T & { component: React.ElementType<P> }) {
    let [beValid, setValid] = useState(true);
    let Comp = component as any;
    useEffect(() => {
        if (APP_STORE.authInfo?.token == null && beValid) {
            setValid(false);
        } else {
            //在这调用api检查token
        }
    })
    return beValid ? <Comp {...rest} /> : <Redirect to={{
        pathname: '/login',
        state: { from: rest.location }
    }} />
}