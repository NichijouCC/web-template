import React, { useEffect, useState } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAppStore } from '../__internal/index';
import { PermissionEnum, RoleEnum } from './rbac';

/**
 * 路由验证权限和token
 * @param props.component 目标组件，即route.component 参数
 * @param props.rest route需要各种参数&目标组件需要各种参数
 */
export function CustomRoute<T extends RouteProps = RouteProps, P = {}>(props: P & T & { needPermission?: PermissionEnum, checkToken?: boolean, component: React.ElementType<P> }) {
    let { component, needPermission, ...rest } = props;
    return <Route {...(rest as any)} render={(routeProps) => {
        return (<CheckPermissionAndToken {...{ ...props, ...routeProps }} />)
    }} />
}


function CheckPermissionAndToken<T extends RouteProps = RouteProps, P = {}>({ component, needPermission, needToken = false, ...rest }: P & T & { needPermission?: PermissionEnum, needToken?: boolean, component: React.ElementType<P> }) {
    let authInfo = useAppStore("authInfo");
    let Comp = component as any;

    useEffect(() => {
        //[可选] 在这调用api检查token,token无限将authInfo置为null
    })

    if (needPermission != null) {
        if (RoleEnum.hasPermission(APP_STORE.role, needPermission)) {
            if (needToken) {
                if (authInfo?.token != null) {
                    return <Comp {...rest} />
                } else {
                    return <Redirect to={{ pathname: '/login', state: { from: rest.location } }} />
                }
            } else {
                return <Comp {...rest} />
            }
        } else {
            return <Redirect to={{ pathname: '/login', state: { from: rest.location } }} />
        }
    } else {
        if (needToken) {
            if (authInfo?.token != null) {
                return <Comp {...rest} />
            } else {
                return <Redirect to={{ pathname: '/login', state: { from: rest.location } }} />
            }
        } else {
            return <Comp {...rest} />
        }
    }
}

/**
 * 路由验证token，跳转登录页面
 * @param props.component 目标组件，即route.component 参数
 * @param props.rest route需要各种参数&目标组件需要各种参数
 */
export function PrivateRoute<T extends RouteProps = RouteProps, P = {}>(props: P & T & { component: React.ElementType<P> }) {
    let { component, ...rest } = props;
    return <Route {...(rest as any)} render={(routeProps) => {
        return (<CheckTokenComp {...{ ...props, ...routeProps }} />)
    }} />
}

function CheckTokenComp<T extends RouteProps = RouteProps, P = {}>({ component, ...rest }: P & T & { component: React.ElementType<P> }) {
    let authInfo = useAppStore("authInfo");

    let Comp = component as any;
    useEffect(() => {
        //[可选] 在这调用api检查token,token无限将authInfo置为null
    })
    return authInfo?.token ? <Comp {...rest} /> : <Redirect to={{
        pathname: '/login',
        state: { from: rest.location }
    }} />
}