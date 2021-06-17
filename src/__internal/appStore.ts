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
const STORE_SERIALIZE_DATA = Symbol("__appStore:marked_data");
// const STORE_MARK_KEY = Symbol("__appStore:marked_key");

/**
 * 全局数据中心
 * 
 * @description
 * 需要被持久化的数据(存储到localStorage)使用 serialize 进行标记
 * 需要用sessionStorage共享的数据 使用share 进行标记
 */
export class AppStore<T = IStoreEvents<any>> extends EventEmitter<T> {
    private _shareData: WebStore;
    private _privateStoreTarget: object;
    private _privateStore: object;
    private constructor(opt: IStoreOption<any> = {}) {
        super();
        let { target, initData } = opt;
        if (target == null) {
            if (AppStore._storeTarget == null) {
                throw new Error(`if storeOpt.target == null, @MyStore must be use and "src/config/customStore" be import in index.tsx`);
            } else {
                target = new AppStore._storeTarget();
            }
        }
        if (opt?.loadDataOnOpen != false) {//mark的数据
            let markedData = localStorage.getItem(STORE_SERIALIZE_DATA.toString());
            if (markedData != null) {
                let storageData = JSON.parse(markedData);
                for (const key in storageData) {
                    target[key] = storageData[key];
                }
            }
        }
        for (let key in initData) {//启动项输入的数据
            target[key] = initData[key];
        }


        let sharedTarget = {};
        let privateTarget = {};
        for (let key in target) {
            if (this.hasSerializeMarkedAtt(key) || this.hasSharedAtt(key)) {
                sharedTarget[key] = target[key];
            } else {
                privateTarget[key] = target[key];
            }
        }

        //---------------------------------share store
        this._privateStoreTarget = privateTarget;
        this._privateStore = new Proxy(privateTarget, {
            set: (obj, prop, value) => {
                let oldValue = obj[prop];
                if (typeof prop == "symbol") throw new Error("APP_STORE not support symbol att");
                obj[prop] = value;

                this.emit("attChange" as any, { att: prop, newValue: value, oldValue } as any);
                this.emit(prop as any, { newValue: value, oldValue } as any);
                return true;
            }
        });

        //---------------------------------share store
        let shareStore = new WebStore(sharedTarget);//storage中共享的数据
        this._shareData = shareStore;
        shareStore.on("webStore:set", (ev) => {
            this.emit("attChange" as any, { att: ev.prop, newValue: ev.newValue, oldValue: ev.oldValue } as any);
            this.emit(ev.prop as any, { newValue: ev.newValue, oldValue: ev.oldValue } as any);

            if (this.hasSerializeMarkedAtt(ev.prop)) {
                this.saveMarkedData();
            }
        });

        this.saveMarkedData();
    }

    static create<P extends object = {}>(opt?: IStoreOption<P>): AppStore<IStoreEvents<P>> & P {
        let store = new AppStore<IStoreEvents<P>>(opt);
        let storedData = new Proxy(store, {
            set: function (obj, prop, value) {
                if (store.hasSerializeMarkedAtt(prop as any) || store.hasSharedAtt(prop as any)) {
                    obj._shareData.setItem(prop as any, value);
                } else {
                    obj._privateStore[prop] = value;
                };
                return true;
            },
            get: function (obj, prop) {
                return obj[prop] ?? obj._privateStore[prop] ?? obj._shareData.getItem(prop as any)
            }
        });
        return storedData as any;
    }

    private hasSerializeMarkedAtt(key: string) {
        return AppStore._serializedAtts.has(key);
    }
    private hasSharedAtt(key: string) {
        return AppStore._sharedAtts.has(key);
    }
    private saveMarkedData() {
        let storeAtts: Set<string> = AppStore._serializedAtts;
        let result = {};
        storeAtts.forEach(item => {
            result[item] = this._shareData.getItem(item);
        });
        localStorage.setItem(STORE_SERIALIZE_DATA.toString(), JSON.stringify(result))
    }

    private loadMarkedData() {
        let markedData = localStorage.getItem(STORE_SERIALIZE_DATA.toString());
        if (markedData != null) {
            let storageData = JSON.parse(markedData);
            for (const key in storageData) {
                this._shareData.setItem(key, storageData[key]);
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
        this._shareData.clear();
        for (let key in this._privateStore) {
            delete this._privateStore[key];
        }

        if (clearStorage) {
            localStorage.removeItem(STORE_SERIALIZE_DATA.toString());
        }
    }

    private static _serializedAtts = new Set<string>();
    private static _sharedAtts = new Set<string>();

    /**
     * 标记需要持久化/共享的数据 
     */
    static Serialize(target: any, name: string) {
        AppStore._serializedAtts.add(name);
    }
    /**
     * 标记需要多界面不持久化仅共享的数据
     */
    static Share(target: any, name: string) {
        AppStore._sharedAtts.add(name);
    }
    private static _storeTarget: new () => any;
    static MyStore(target: Function) {
        AppStore._storeTarget = target as any;
    }
}