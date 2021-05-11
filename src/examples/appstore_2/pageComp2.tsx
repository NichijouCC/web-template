import React from "react";
import { Button, message } from "antd";

export function PageComp2() {
    return (
        <div>
            pagecomp2组件
            <Button onClick={() => {
                APP_STORE.confirmBox = {
                    beActive: true,
                    data: {
                        title: "PageComp2",
                        onOk: () => message.success("PageComp2 确认成功"),
                        content: <span>@@确认一下?</span>
                    }
                }
            }}>我也确认下</Button>
        </div>)
}