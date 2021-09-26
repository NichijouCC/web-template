import { EventEmitter } from "@mtgoo/ctool";
import { IStoreOption } from "./iapp";
import { debuglog } from "./util";

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

const Rpc = "store:rpc"
enum RpcMethod {
    REQ_GET_DATA = "req:get_store_data",
    RESP_GET_DATA = "resp:get_store_data",
    REQ_SET_ATT = "req:set_store_att",
}

interface IRpcMessage {
    method: RpcMethod,
    params?: any
}


/**
 * 全局数据中心
 * 
 * @description
 * 需要被持久化的数据(存储到localStorage)使用 serialize 进行标记
 * 需要被多页面共享的数据 使用share 进行标记
 */
export class AppStore<T = IStoreEvents<any>> extends EventEmitter<T> {
    private _target: object;
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
        for (let key in initData) {//启动项输入的数据
            target[key] = initData[key];
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
        this._target = target;

        window.addEventListener("storage", (ev) => {
            if (ev.key == Rpc && ev.newValue != null) {
                try {
                    let message: IRpcMessage = JSON.parse(ev.newValue);
                    let { method, params } = message || {};
                    if (method == null) return;
                    debuglog(`【收到RPC请求】：method- ${method} params- ${JSON.stringify(params)}`, ev);

                    if (method == RpcMethod.REQ_GET_DATA) {
                        this.rpc({ method: RpcMethod.RESP_GET_DATA, params: this.sharedData });
                    }
                    else if (method == RpcMethod.RESP_GET_DATA) {
                        for (let key in params) {
                            this.set(key, params[key], true);
                        }
                    }
                    else if (method == RpcMethod.REQ_SET_ATT) {
                        this.set(params.key, params.value, true);
                    }
                }
                catch (err) {
                    console.error("store 通信出错");
                }
            }
        });
        this.rpc({ method: RpcMethod.REQ_GET_DATA });
        this.saveStoreMarkedData();
    }

    private get sharedData() {
        let shareData = {};
        for (let key in this._target) {
            if (this.checkBeSharedKey(key)) {
                shareData[key] = this._target[key];
            }
        }
        return shareData;
    }

    private set(key: string, newValue: any, beRpc: boolean = false) {
        let oldValue = this._target[key];
        this.emit("attChange" as any, { att: key, newValue, oldValue } as any);
        this.emit(key as any, { newValue, oldValue } as any);
        this._target[key] = newValue;
        if (this.checkBeStoredKey(key)) {
            this.saveStoreMarkedData();
        }

        if (beRpc == false && this.checkBeSharedKey(key)) {
            this.rpc({ method: RpcMethod.REQ_SET_ATT, params: { key, value: newValue } });
        }
    }

    private rpc(message: IRpcMessage) {
        debuglog(`发送 ${JSON.stringify(message)}`);
        localStorage.setItem(Rpc, JSON.stringify(message));
        localStorage.removeItem(Rpc);
    }

    static create<P extends object = {}>(opt?: IStoreOption<P>): AppStore<IStoreEvents<P>> & P {
        let store = new AppStore<IStoreEvents<P>>(opt);
        let storedData = new Proxy(store, {
            set: function (obj, prop, value) {
                obj.set(prop as string, value)
                return true;
            },
            get: function (obj, prop) {
                return obj[prop] ?? obj._target[prop]
            }
        });
        return storedData as any;
    }

    private checkBeStoredKey(key: string) {
        return AppStore._serializedAtts.has(key);
    }
    private checkBeSharedKey(key: string) {
        return AppStore._sharedAtts.has(key);
    }
    private saveStoreMarkedData() {
        let storeAtts: Set<string> = AppStore._serializedAtts;
        let result = {};
        storeAtts.forEach(item => {
            result[item] = this._target[item];
        });
        localStorage.setItem(STORE_SERIALIZE_DATA.toString(), JSON.stringify(result))
    }

    private loadMarkedData() {
        let markedData = localStorage.getItem(STORE_SERIALIZE_DATA.toString());
        if (markedData != null) {
            let storageData = JSON.parse(markedData);
            for (const key in storageData) {
                this.set(key, storageData[key]);
            }
        }
    }

    [SAVE]() {
        this.saveStoreMarkedData();
    }

    [LOAD]() {
        this.loadMarkedData();
    }
    /**
     * 清空store的数据
     */
    clear(clearStorage: boolean = true) {
        for (let key in this._target) {
            this.set(key, undefined);
        }
        if (clearStorage) {
            localStorage.removeItem(STORE_SERIALIZE_DATA.toString());
        }
    }

    private static _serializedAtts = new Set<string>();
    private static _sharedAtts = new Set<string>();

    /**
     * 数据保存到localStorage数据的key集合
     */
    static Serialize(target: any, name: string) {
        AppStore._serializedAtts.add(name);
        AppStore._sharedAtts.add(name);
    }
    /**
     * 多界面数据共享数据的key集合
     */
    static Share(target: any, name: string) {
        AppStore._sharedAtts.add(name);
    }
    private static _storeTarget: new () => any;
    static MyStore(target: Function) {
        AppStore._storeTarget = target as any;
    }
}