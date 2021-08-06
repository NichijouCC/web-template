import { useAppStore } from "@/__internal";
import { Menu, MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CustomRoute } from "./privateRoute";
import { PermissionEnum, RoleEnum, WrapPermissionComp } from "./rbac";

export interface IMenuRouteElementProps {
    key: string,
    /**
     * menu标题
     */
    title: string | React.ReactNode,
    children?: IMenuRouteElementProps[],
    /**
     * 路由
     */
    path?: string,
    onclick?: () => void,
    /**
     * 页面组件
     */
    component?: React.ComponentType,
    exact?: boolean,
    /**
     * 需要权限
     */
    needPermission?: PermissionEnum,
}

function routeMenuElement(params: IMenuRouteElementProps) {
    let { key, title, path, children, onclick } = params;
    if (children != null) {
        return (
            <Menu.SubMenu
                key={key}
                title={title}>
                {
                    children.filter(item => RoleEnum.hasPermission(APP_STORE.role, item.needPermission))
                        .map(chid => routeMenuElement(chid))
                }
            </Menu.SubMenu>
        )
    } else {
        return (
            <Menu.Item key={key} onClick={onclick}>
                {
                    path ? <Link to={path}>
                        {title}
                    </Link> :
                        { title }
                }
            </Menu.Item>
        )
    }
}

export function RouteForMenu(props: { menus: IMenuRouteElementProps[] }) {
    const [routes, setRoutes] = useState<IMenuRouteElementProps[]>([]);
    useEffect(() => {
        let route: IMenuRouteElementProps[] = [];
        let loop = (node: IMenuRouteElementProps) => {
            if (node.component != null) {
                route.push(node);
            }
            if (node.children?.length > 0) {
                node.children.forEach(item => loop(item))
            }
        }
        props.menus.forEach(item => loop(item));
        setRoutes(route);
    }, [])
    return <React.Fragment>
        {routes.map(item => <CustomRoute needPermission={item.needPermission} key={item.path} component={item.component} path={item.path} />)}
    </React.Fragment>
}

export function MenuForRoute({ menus, ...rest }: MenuProps & { menus: IMenuRouteElementProps[] }) {
    let role = useAppStore("role");
    return <Menu {...rest}>
        {
            menus.map((item, index) => {
                if (item.needPermission) {
                    let beAllowed = RoleEnum.hasPermission(role, item.needPermission);
                    return beAllowed ? routeMenuElement(item) : null
                } else {
                    return routeMenuElement(item)
                }
            })
        }
    </Menu>
}
