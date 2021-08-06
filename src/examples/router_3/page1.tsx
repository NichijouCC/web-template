import { RoleEnum } from "@/comps/rbac";
import { Select } from "antd";
import React from "react";

export default function Page1() {
    return <div>
        <span>切换角色：</span>
        <Select style={{ width: 300 }} onChange={(opt) => {
            APP_STORE.role = opt;
        }}>
            {RoleEnum.toList().map(item => <Select.Option key={item.code} value={item.code} op={item}>{item.text}</Select.Option>)}
        </Select>
    </div>
}