import axios from 'axios';

/**
 * 配置axios的基本配置
 */
export function initAxiosConfig() {
    axios.defaults.baseURL = APP_CONFIG?.api;
    axios.defaults.timeout = 10000; //响应时间
    axios.interceptors.request.use((config) => {
        if (APP_STORE?.authInfo?.token) {
            config.headers.common['Authorization'] = "Token " + APP_STORE.authInfo.token;
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
                    return response.data;
                } else {
                    //-----------------------------------------------------------
                    //              处理公共异常code状态（可选）
                    //-----------------------------------------------------------
                    {//异常code举例：处理401
                        if (data.code == 401) {//认证失败
                            INTERNAL_STORE?.clear();
                            window.location.reload();
                        }
                    }
                    return Promise.reject(response.data);
                }
            }
        });
}
/**
 * 规范化的数据返回格式
 */
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
     * 数据分页
     */
    page_info?: {
        /**
         * 第xx页
         */
        page_index: number;
        /**
         * 每页数据条数
         */
        page_size: number;
        /**
         * 总条数
         */
        total_size: number;
    }
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