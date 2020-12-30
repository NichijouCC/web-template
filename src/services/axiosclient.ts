import axios from 'axios';
import { GlobalStore } from '../_init/globalStore';

export function initAxiosConfig() {
    axios.defaults.baseURL = GlobalStore.APP_CONFIG?.current_url_config.api;
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
            let data = response.data as { code?: number, message: string, data: any }
            if (data.code == null) {
                return response.data;
            } else {
                if (response.data.code == 200 || 2000) {
                    return response.data?.data ?? response.data;
                } else {
                    if (data.code == 401) {//认证失败
                        GlobalStore.clear();
                        window.location.reload();
                    }
                    return Promise.reject(response.data);
                }
            }
        });
}

interface IcustomResponse<T = any> {
    /**
     * 状态码
     */
    code?: number;
    /**
     * 返回的数据
     */
    data: T;
    /**
     * 数据状态描述。例如：`success`
     */
    message: string;
    /**
     * 数据分页.第xx页
     */
    page?: number;
    /**
     * 数据分页. 每页数据条数
     */
    page_size?: number;
    /**
     * 数据分页. 总条数
     */
    totalCount?: number;
}

declare module 'axios' {
    export interface AxiosInstance {
        get<T = any>(url: string, config?: AxiosRequestConfig): Promise<IcustomResponse<T>>;
        delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<IcustomResponse<T>>;
        head<T = any>(url: string, config?: AxiosRequestConfig): Promise<IcustomResponse<T>>;
        options<T = any>(url: string, config?: AxiosRequestConfig): Promise<IcustomResponse<T>>;
        post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IcustomResponse<T>>;
        put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IcustomResponse<T>>;
        patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IcustomResponse<T>>;
    }
}