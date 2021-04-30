import { EventEmitter } from "@mtgoo/ctool";
import { IStoreOption } from "./iapp";
import { WebStore } from "./webStore";

interface IPrivateEvents {
    attChange: { att: string, newValue: any, oldValue: any }
}
type IAttEvents<T extends object> = {
    [key in keyof T]: { newValue: any, oldValue: any }
}
export type IStoreEvents<T extends object = {}> = IPrivateEvents & IAttEvents<T> & IDataEvents;
const SAVE = Symbol("save");
const LOAD = Symbol("load");

/**
 * localStorage中的key字段
 */
const STORE_MARKED_DATA = Symbol("__appStore:marked_data");
const STORE_MARK_KEY = Symbol("__appStore:marked_key");

/**
 * 全局数据中心
 * 
 * @description
 * 需要被持久化的数据(存储到localStorage)使用 serialize 进行标记
 */
export class AppStore<T = IStoreEvents<any>> extends EventEmitter<T> {
    private _target: WebStore;
    // private _proxyTarget: object;
    private constructor(opt: IStoreOption<any> = {}) {
        super();
        let { target, initData, saveItemToStorage = "none" } = opt;
        if (target == null) {
            if (_store_target == null) {
                throw new Error(`if storeOpt.target == null, @MyStore must be use and "src/config/customStore" be import in index.tsx`);
            } else {
                target = new _store_target();
            }
        }
        for (let key in initData) {
            target[key] = initData[key];
        }
        if (opt?.loadDataOnOpen != false) {
            this.loadMarkedData();
        }

        let privateStore = new WebStore(target);
        this._target = privateStore;

        privateStore.on("webStore:set", (ev) => {
            this.emit("attChange" as any, { att: ev.prop, newValue: ev.newValue, oldValue: ev.oldValue } as any);
            this.emit(ev.prop as any, { newValue: ev.newValue, oldValue: ev.oldValue } as any);
        })

        if (saveItemToStorage != "none") {
            let storage = opt.saveItemToStorage == "localStorage" ? localStorage : sessionStorage;
            for (const key in target) {
                storage.setItem(key, JSON.stringify(target[key]));
            }
            this.on("attChange" as any, (ev: any) => {
                let { att, newValue } = ev;
                storage.setItem(att, JSON.stringify(newValue));

                if (this.hasMarkedAtt(att)) this.saveMarkedData();
            })
        }
    }

    static create<P extends object = {}>(opt?: IStoreOption<P>): AppStore<IStoreEvents<P>> & P {
        let store = new AppStore<IStoreEvents<P>>(opt);
        let storedData = new Proxy(store, {
            set: function (obj, prop, value) {
                if (typeof value == "function") {
                    obj[prop] = value;
                } else {
                    obj._target.setItem(prop as any, value);
                }
                return true;
            },
            get: function (obj, property) {
                if (obj[property] != null) {
                    return obj[property];
                } else {
                    return obj._target.getItem(property as any);
                }
            }
        });
        return storedData as any;
    }

    private hasMarkedAtt(key: string) {
        let storeAtts: Set<string> = this._target.constructor[STORE_MARK_KEY];
        return storeAtts.has(key);
    }

    private saveMarkedData() {
        let storeAtts: Set<string> = this._target.constructor[STORE_MARK_KEY];
        let result = {};
        storeAtts.forEach(item => {
            result[item] = this._target.getItem(item);
        });
        localStorage.setItem(STORE_MARKED_DATA.toString(), JSON.stringify(result))
    }

    private loadMarkedData() {
        let markedData = localStorage.getItem(STORE_MARKED_DATA.toString());
        if (markedData != null) {
            let storageData = JSON.parse(markedData);
            for (const key in storageData) {
                this._target.setItem(key, storageData[key]);
            }
        }
    }

    [SAVE]() {
        this.saveMarkedData();
    }

    [LOAD]() {
        this.loadMarkedData();
    }
    /**
     * 清空store的数据
     */
    clear(clearStorage: boolean = true) {
        this._target.clear();
        if (clearStorage) {
            localStorage.removeItem(STORE_MARKED_DATA.toString());
        }
    }
}

/**
 * 标记需要持久化的数据 
 */
export function Att(target: any, name: string) {
    let store: Set<string> = target.constructor[STORE_MARK_KEY];
    if (store == null) {
        store = target.constructor[STORE_MARK_KEY] = new Set<string>();
    }
    store.add(name);
}

var _store_target: new () => any;
export function MyStore(target: Function) {
    _store_target = target as any;
}
