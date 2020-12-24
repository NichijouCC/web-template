import 'reflect-metadata';
import { EnvTypes, IappConfig } from './app_config';

const storeKey = "store";
function seralize<T>(target: T, name: string) {
    let store: string[] = Reflect.getMetadata(storeKey, target);
    if (store == null) {
        Reflect.defineMetadata(storeKey, [name], target);
    } else {
        store.push(name);
    }
}

/**
 * 全局数据中心
 * 
 * @description
 * 需要被持久化的数据使用 seralize 进行标记
 * 
 */
export class StoreCenter {
    @seralize
    authInfo: IauthInfo;

    /**
     * 当前的开发环境
     */
    APP_ENV: EnvTypes;
    /**
     * 当前版本时间
     */
    APP_VERSION: string;
    /**
     * 当前使用的配置
     */
    APP_CONFIG: IappConfig

    /**
     * 全局数据中心初始化
     */
    init() {
        this.APP_ENV = process.env.APP_ENV as any;//from env+webapck
        this.APP_VERSION = APP_VERSION;//from env+webapck

        window.addEventListener('beforeunload', () => {
            this.saveDataToLocalStorge();
        }, false);

        this.loadDataFromLocalStorage();
    }

    /**
     * 将需要持久化的数据存储到LocalStorge中
     */
    private saveDataToLocalStorge() {
        let store: string[] = Reflect.getMetadata(storeKey, StoreCenter);
        store?.forEach(key => {
            let value = Reflect.get(this, key);
            if (value != null) {
                localStorage.setItem(key, JSON.stringify(value))
            }
        })
    }

    /**
     * 从localstorge加载被持久化的数据
     */
    private loadDataFromLocalStorage() {
        let store: string[] = Reflect.getMetadata(storeKey, StoreCenter);
        store?.forEach(key => {
            let storedInfo = localStorage.getItem(key);
            if (storedInfo) {
                Reflect.set(this, key, JSON.parse(storedInfo));
            }
        })
    }

    clear() {
        Object.keys(this).forEach(key => {
            Reflect.set(this, key, null);
        })
    }
}
export const GlobalStore = new StoreCenter();


/**
 * 登录后的一些数据存储起来,例如：token
 */
export interface IauthInfo {
    token: string;
}