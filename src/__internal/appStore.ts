import "reflect-metadata";

export interface IstoreOption {
    /**
     * 是否将数据存入Storage，默认：“none”
     */
    saveItemToStorage?: "localStorage" | "sessionstorage" | "none";
    /**
     * 启动的时候加载上次的数据，默认：true
     */
    loadDataOnOpen?: boolean;
}
/**
 * 全局数据中心
 * 
 * @description
 * 需要被持久化的数据(存储到localstorage)使用 seralize 进行标记
 * 
 */
export class APPSTORE<T extends object = {}> {
    private _store: T;
    get storeIns() { return this._store }
    constructor(store: T, opt?: IstoreOption) {
        if (opt?.saveItemToStorage && opt?.saveItemToStorage != "none") {
            let storage = opt.saveItemToStorage == "localStorage" ? localStorage : sessionStorage;
            this._clearStore = () => storage.clear();

            store = new Proxy(store, {
                set: function (obj, prop, value) {
                    storage.setItem(prop.toString(), JSON.stringify(value));
                    return true;
                }
            });
        }
        this._store = store;
        window.addEventListener('beforeunload', () => {
            this.saveDataToLocalStorge();
        }, false);

        if (opt?.loadDataOnOpen != false) {
            this.loadDataFromLocalStorage();
        }
        localStorage.removeItem(storeKey);
    }

    /**
     * 将需要持久化的数据存储到LocalStorge中
     */
    private saveDataToLocalStorge() {
        let store: string[] = Reflect.getMetadata(storeKey, this._store);

        let needStoreData = {};
        store?.forEach(key => {
            let value = Reflect.get(this, key);
            needStoreData[key] = value;
        })

        localStorage.setItem(storeKey, JSON.stringify(needStoreData))
    }

    /**
     * 从localstorge加载被持久化的数据
     */
    private loadDataFromLocalStorage() {
        let store: string[] = Reflect.getMetadata(storeKey, this._store);
        let storedInfo = JSON.parse(localStorage.getItem(storeKey));
        if (storedInfo) {
            store?.forEach(key => {
                Reflect.set(this, key, storedInfo[key]);
            })
        }
    }

    private _clearStore = () => { };
    /**
     * 清空store的数据
     */
    clear(clearStorage: boolean = true) {
        let store: string[] = Reflect.getMetadata(storeKey, this._store);
        store?.forEach(key => {
            Reflect.set(this._store, key, null);
        });
        if (clearStorage) this._clearStore();
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

const storeKey = "__private__store";