import { PermissionEnum, RoleEnum, usePermission, WithPermission, WrapPermissionComp } from "@/comps/rbac";
import { mapAppStoreToProps, useAppStore } from "@/__internal";
import { Select } from "antd";
import React from "react";

export function App() {
    return <div>
        <span>切换角色：</span>
        <Select<RoleEnum>
            style={{ width: 300 }}
            onChange={(value) => {
                APP_STORE.role = value;
            }}
        >{RoleEnum.toList().map(item => <Select.Option key={item.code} value={item.code}>{item.text}</Select.Option>)}</Select>
        <Comp0 />
        <WrapPermissionComp component={Comp1} needPermission={PermissionEnum.PRIVATE_1} />
        <Comp2 />
        <Comp3 />
        <Comp4 />
        <Comp5 />
    </div>
}

export class Comp0 extends React.Component {
    render() {
        return <div>"comp0 无需权限"</div>
    }
}

//通过套壳加权限限制
export class Comp1 extends React.Component {
    render() {
        return <div>"comp1 需要权限1"</div>
    }
}

//通过装饰器加权限控制
@WithPermission(PermissionEnum.PRIVATE_2)
export class Comp2 extends React.Component {
    render() {
        return <div>"comp2 需要权限2"</div>
    }
}

//通过hooks判断是否有权限
export function Comp3() {
    let beAllowed = usePermission(PermissionEnum.PRIVATE_1);
    return beAllowed ? <div>"comp3 需要权限1"</div> : null
}


// class组件获取自身角色，做权限判断
@mapAppStoreToProps(["role"])
export class Comp4 extends React.Component<{ role?: RoleEnum }>{
    render() {
        let beAllowed = RoleEnum.hasPermission(this.props.role, PermissionEnum.PRIVATE_2);
        return beAllowed ? <div>"comp4 需要权限2"</div> : null
    }
}

// function组件获取自身角色，做权限判断
export function Comp5() {
    let role = useAppStore("role");
    let beAllowed = RoleEnum.hasPermission(role, PermissionEnum.PRIVATE_2);
    return beAllowed ? <div>"comp5 需要权限1"</div> : null
}