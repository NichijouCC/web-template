import { EventEmitter } from "@mtgoo/ctool";
import { IStoreOption } from "./iapp";

interface IPrivateEvents {
    attChange: { att: string, newValue: any, oldValue: any }
}
type IAttEvents<T extends object> = {
    [key in keyof T]: { newValue: any, oldValue: any }
}
export type IStoreEvents<T extends object = {}> = IPrivateEvents & IAttEvents<T> & IDataEvents;
const SAVE = Symbol("save");
const LOAD = Symbol("load");
const STORE_KEY = Symbol("__private__store");
const STORE_ATT_KEY = Symbol("_store_att");

/**
 * 全局数据中心
 * 
 * @description
 * 需要被持久化的数据(存储到localStorage)使用 serialize 进行标记
 */
export class AppStore<T = IStoreEvents<any>> extends EventEmitter<T> {
    private _target: object;
    private _proxyTarget: object;
    /**
     * For Debug：清除内部数据
     */
    static hidePrivateData: boolean = true;
    private constructor(opt: IStoreOption<any> = {}) {
        super();
        let { target, initData, saveItemToStorage = "none" } = opt;
        if (target == null) {
            if (_store_target == null) {
                throw new Error(`if storeOpt.target == null, @MyStore must be use and "src/config/customStore" must be import in index.tsx`);
            } else {
                target = new _store_target();
            }
        }
        for (let key in initData) {
            target[key] = initData[key];
        }

        this._target = target;
        if (opt?.loadDataOnOpen != false) {
            let storageData = this.loadDataFromLocalStorage();
            for (let key in storageData) {
                if (target[key] == null) {
                    target[key] = storageData[key];
                }
            }
        }
        this._proxyTarget = new Proxy(target, {
            set: (obj, prop, value) => {
                obj[prop] = value;
                this.emit("attChange" as any, { att: prop.toString(), newValue: value, oldValue: this[prop] } as any);
                this.emit(prop.toString() as any, { newValue: value, oldValue: this[prop] } as any)
                return true;
            }
        });

        if (saveItemToStorage != "none") {
            let storage = opt.saveItemToStorage == "localStorage" ? localStorage : sessionStorage;
            this._clearStore = () => storage.clear();
            for (const key in target) {
                storage.setItem(key, JSON.stringify(target[key]));
            }
            this.on("attChange" as any, (ev: any) => {
                let { att, newValue } = ev;
                storage.setItem(att, JSON.stringify(newValue));
            })
        }

        window.addEventListener('beforeunload', () => {
            this.saveDataToLocalStorage();
        }, false);

        if (AppStore.hidePrivateData) {
            localStorage.removeItem(STORE_KEY.toString());
        }
    }

    static create<P extends object = {}>(opt?: IStoreOption<P>): AppStore<IStoreEvents<P>> & P {
        let store = new AppStore<IStoreEvents<P>>(opt);
        let storedData = new Proxy(store, {
            set: function (obj, prop, value) {
                obj._proxyTarget[prop] = value;
                return true;
            },
            get: function (obj, property) {
                if (obj._proxyTarget[property] != null) {
                    return obj._proxyTarget[property]
                } else {
                    return obj[property]
                }
            }
        });
        return storedData as any;
    }

    /**
     * 将需要持久化的数据存储到LocalStorage中
     */
    private saveDataToLocalStorage() {
        let storeAtts: string[] = this._target.constructor[STORE_ATT_KEY];
        let result = {};
        storeAtts?.forEach(key => {
            Reflect.set(result, key, this._target[key]);
        })
        localStorage.setItem(STORE_KEY.toString(), JSON.stringify(result))
    }

    /**
     * 从localStorage加载被持久化的数据
     */
    private loadDataFromLocalStorage() {
        let storedInfo = JSON.parse(localStorage.getItem(STORE_KEY.toString()));
        return storedInfo;
    }

    private _clearStore = () => { };

    [SAVE]() {
        this.saveDataToLocalStorage();
    }

    [LOAD]() {
        let storageData = this.loadDataFromLocalStorage();
        for (const key in storageData) {
            this._target[key] = storageData[key];
        }
    }
    /**
     * 清空store的数据
     */
    clear(clearStorage: boolean = true) {
        for (const key in this._target) {
            this._target[key] = undefined;
        }
        if (clearStorage) this._clearStore();
    }
}

/**
 * 标记需要持久化的数据 
 */
export function Att(target: any, name: string) {
    let store: string[] = target.constructor[STORE_ATT_KEY];
    if (store == null) {
        store = target.constructor[STORE_ATT_KEY] = [];
    }
    store.push(name);
}

var _store_target: new () => any;
export function MyStore(target: Function) {
    _store_target = target as any;
}
