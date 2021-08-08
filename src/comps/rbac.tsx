import { useAppStore } from "@/__internal";
import React, { useMemo } from "react";

/**
 * 人的角色分类
 */
export enum RoleEnum {
    /**
     * 管理员
     */
    ADMIN = 1,
    /**
     * 普通人
     */
    COMMON = 2,
    /**
     * 游客
     */
    VISITOR = 3
}

export namespace RoleEnum {
    const config = {
        1: { code: RoleEnum.ADMIN, text: "管理员" },
        2: { code: RoleEnum.COMMON, text: "普通人" },
        3: { code: RoleEnum.VISITOR, text: "游客" }
    }
    export function hasPermission(role: RoleEnum, right: PermissionEnum): boolean {
        if (right == null) return true
        if (role == null) return false
        if (role == RoleEnum.ADMIN) return true
        return (RolePermissionConfig[role] & right) != 0
    }
    export function toList() {
        return Object.values(config).sort((a, b) => b.code - a.code)
    }
}
/**
 * 权限分类
 * 
 * 一种权限分配一个二进制位
 */
export enum PermissionEnum {
    /**
     * 最弱权限
     */
    NONE = 0B0001,
    /**
     * 其他待分类
     */
    PRIVATE_1 = 0B0010,
    PRIVATE_2 = 0B0100,
}

/**
 * 配置角色权限
 * 
 */
const RolePermissionConfig: Record<RoleEnum, number> = {} as any;
{
    RolePermissionConfig[RoleEnum.COMMON] = PermissionEnum.NONE | PermissionEnum.PRIVATE_1;
    RolePermissionConfig[RoleEnum.VISITOR] = PermissionEnum.NONE;
}

/**
 * 通过装饰器挂到需要权限的组件类上，类似：WithRouter
 * @param needPermission 组件需要的权限 
 * @returns 
 */
export function WithPermission(needPermission: PermissionEnum) {
    return (WrappedComponent) => {
        return class extends React.Component<any, { role: RoleEnum }>{
            private _dispose: () => void;
            constructor(props) {
                super(props)
                this.state = {
                    role: APP_STORE.role
                };
                let handler = (ev: { newValue: any, oldValue: any }) => {
                    let attState = {};
                    attState["role"] = ev.newValue;
                    this.setState(attState);
                };
                APP_STORE.on("role", handler);
                this._dispose = () => {
                    APP_STORE.off("role", handler);
                }
            }
            componentWillUnmount() {
                this._dispose?.();
            }
            render() {
                return RoleEnum.hasPermission(this.state.role, needPermission) ? <WrappedComponent {...this.props} /> : null
            }
        }
    }
}

/**
 * 套壳需要权限的组件
 * @param props 
 * @returns 
 */
export function WrapPermissionComp<P extends object = {}>(props: { needPermission: PermissionEnum, component: React.ElementType<P> } & P) {
    let role = useAppStore("role");
    let beAllowed = RoleEnum.hasPermission(role, props.needPermission);
    let Comp = props.component as any;
    return beAllowed ? <Comp {...props as any} /> : null
}

/**
 * hooks需要权限的组件
 * @param needPermission 
 * @returns 
 */
export function usePermission(needPermission: PermissionEnum) {
    let role = useAppStore("role");
    let beAllowed = useMemo(() => {
        return RoleEnum.hasPermission(role, needPermission)
    }, [needPermission, role]);
    return beAllowed;
}