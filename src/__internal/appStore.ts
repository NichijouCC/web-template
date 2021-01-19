import "reflect-metadata";

/**
 * 全局数据中心
 * 
 * @description
 * 需要被持久化的数据(存储到localstorage)使用 seralize 进行标记
 * 
 */
export class APPSTORE<T extends object = {}> {
    private _store: T;
    constructor(store: T) {
        this._store = store;
        window.addEventListener('beforeunload', () => {
            this.saveDataToLocalStorge();
        }, false);

        this.loadDataFromLocalStorage();
    }

    /**
     * 将需要持久化的数据存储到LocalStorge中
     */
    private saveDataToLocalStorge() {
        let store: string[] = Reflect.getMetadata(storeKey, this._store);
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
        let store: string[] = Reflect.getMetadata(storeKey, this._store);
        store?.forEach(key => {
            let storedInfo = localStorage.getItem(key);
            if (storedInfo) {
                Reflect.set(this, key, JSON.parse(storedInfo));
            }
        })
    }

    /**
     * 清空store的数据
     */
    clear() {
        let store: string[] = Reflect.getMetadata(storeKey, this._store);
        store?.forEach(key => {
            Reflect.set(this, key, null);
        })
    }

}

/**
 * store 
 */
export function Att<K>(target: K, name: string) {
    let store: string[] = Reflect.getMetadata(storeKey, target);
    if (store == null) {
        Reflect.defineMetadata(storeKey, [name], target);
    } else {
        store.push(name);
    }
}

const storeKey = "store";