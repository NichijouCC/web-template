import axios from 'axios';
import { GlobalStore } from '../_init/globalStore';

export function initAxiosConfig() {
    axios.defaults.baseURL = GlobalStore.APP_CONFIG?.api;
    // axiosClient.defaults.withCredentials = true;
    axios.defaults.timeout = 30000; //响应时间
    axios.interceptors.request.use((config) => {
        if (localStorage.token) {
            config.headers.common['Authorization'] = "Token " + GlobalStore.authInfo?.token;
        }
        return config
    });

    axios.interceptors.response.use(
        response => {
            let code = response.data?.code;
            if (code == null) {
                return response.data?.data ?? response.data;
            } else {
                if (response.data.code == 200 || 2000) {
                    return response.data?.data ?? response.data;
                } else {
                    if (code == 401) {//认证失败
                        GlobalStore.clear();
                        window.location.reload();
                    }
                    return Promise.reject(response.data);
                }
            }
        });
}