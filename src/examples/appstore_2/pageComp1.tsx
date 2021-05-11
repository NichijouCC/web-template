import React from "react";
import { Button, message } from "antd";

export function PageComp1() {
    return (
        <div>
            pagecomp1组件
            <Button onClick={() => {
                APP_STORE.confirmBox = {
                    beActive: true,
                    data: {
                        title: "PageComp1",
                        onOk: () => message.success("PageComp1 确认成功"),
                        content: <span>xx确认一下?</span>
                    }
                }
            }}>确认下</Button>
        </div>)
}