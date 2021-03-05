import React from "react";

export default function Login(props) {
    return <button onClick={() => {
        APP_STORE.authInfo = { token: "XXX" };
        console.log("login", props);
        props.history.push({ pathname: '/page1' })
    }}>登录</button>
}