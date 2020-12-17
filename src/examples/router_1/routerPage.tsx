import React from "react";

export function RouterPage(props: { children?: JSX.Element }) {
    return <div>
        二级路由
        {props?.children}
    </div>
}