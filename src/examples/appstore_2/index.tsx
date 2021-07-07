import React from "react";
import { MyApp } from "../../__internal/index";
import '@/config/myStore';
import { App } from "./app";
import 'antd/dist/antd.css';

/**
 * 业务向：共享确认对话框(配合app_store)
 */
MyApp.start(<App />)
