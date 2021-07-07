import { useAppStore } from "@/__internal/index";
import { Modal } from "antd";
import React from "react";

export function GlobalConfirmBox() {
    let confirm = useAppStore("confirmBox");
    return (<Modal
        visible={confirm.beActive}
        title={confirm.data?.title}
        onOk={() => {
            confirm.data?.onOk?.();
            APP_STORE.confirmBox = { beActive: false };
        }}
        onCancel={() => {
            APP_STORE.confirmBox = { beActive: false }
        }} >
        {confirm.beActive && confirm.data?.content}
    </Modal>)
}