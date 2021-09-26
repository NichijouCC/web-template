import React from "react";
import { useEffect, useState } from "react";
import { IAppStore, useAppStore } from "../../__internal/index";

/**
 * 使用提供的帮助函数使用APP_STORE
 */
export function FuncComp3() {
    let shared_att = useAppStore("shared_att");
    return <div>【FuncComp3】shared_att:{shared_att}</div>
}