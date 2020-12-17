import 'reflect-metadata';

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
     * 全局数据中心初始化
     */
    init() {
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
            localStorage.setItem(key, JSON.stringify(Reflect.get(this, key)))
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
}
export const GlobalStore = new StoreCenter();


/**
 * 登录后的一些数据存储起来,例如：token
 */
export interface IauthInfo {
    token: string;
}