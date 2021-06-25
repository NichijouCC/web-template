import { debuglog } from "./util";
import { EventEmitter } from "@mtgoo/ctool"

const Rpc = "store:rpc"
enum RpcMethod {
    REQ_GET_DATA = "req:get_store_data",
    RESP_GET_DATA = "resp:get_store_data",
    REQ_SET_ATT = "req:set_store_att",
    REQ_REMOVE_ATT = "req:remove_store_att",
    REQ_CLEAR = "req:clear_store",
}

interface IRpcMessage {
    method: RpcMethod,
    params?: any
}

/**
 * 有事件的sessionStorage
 */
export class WebStore extends EventEmitter<{ "webStore:set": { prop: string, newValue: any, oldValue: any } }> {
    private _data: any = {};
    private static privateStore = "__webStore:data";
    setItem = (key: string, value: any, notify: boolean = true) => {
        debuglog(`【store】：set ${key} ${value} ${notify && "notify"}`);
        this._data[key] = value;
        sessionStorage.setItem(WebStore.privateStore, JSON.stringify(this._data));
        if (notify) {
            WebStore.rpc({ method: RpcMethod.REQ_SET_ATT, params: { key, value } });
        }
    }
    getItem = (key: string) => {
        return this._data[key];
    }

    removeItem = (key: string, notify: boolean = true) => {
        debuglog(`【store】：remove ${key} ${notify && "notify"}`);
        this._data[key] = undefined;
        sessionStorage.setItem(WebStore.privateStore, JSON.stringify(this._data));
        if (notify) {
            WebStore.rpc({ method: RpcMethod.REQ_REMOVE_ATT, params: key });
        }
    }
    clear = (notify: boolean = true) => {
        debuglog(`【store】：clear`);
        for (const key in this._data) {
            this._data[key] = undefined;
        }
        sessionStorage.removeItem(WebStore.privateStore);
        if (notify) {
            WebStore.rpc({ method: RpcMethod.REQ_CLEAR });
        }
    }

    get currentData() { return this._data }

    constructor(initData = {}) {
        super();
        this._data = new Proxy(initData, {
            set: (obj, prop, value) => {
                let oldValue = obj[prop];
                if (typeof prop == "symbol") throw new Error("APP_STORE not support symbol att");
                obj[prop] = value;
                this.emit("webStore:set", { prop, oldValue, newValue: value });
                return true;
            }
        });

        window.addEventListener("storage", (ev) => {
            if (ev.key == Rpc && ev.newValue != null) {
                try {
                    let message: IRpcMessage = JSON.parse(ev.newValue);
                    let { method, params } = message || {};
                    if (method == null) return;
                    debuglog(`【收到RPC请求】：method- ${method} params- ${JSON.stringify(params)}`, ev);

                    if (method == RpcMethod.REQ_GET_DATA) {
                        WebStore.rpc({ method: RpcMethod.RESP_GET_DATA, params: initData });
                    }
                    else if (method == RpcMethod.RESP_GET_DATA) {
                        for (let key in params) {
                            this._data[key] = params[key];
                        }
                    }
                    else if (method == RpcMethod.REQ_SET_ATT) {
                        this.setItem(params.key, params.value, false);
                    }
                    else if (method == RpcMethod.REQ_REMOVE_ATT) {
                        this.setItem(params, undefined, false);
                    }
                    else if (method == RpcMethod.REQ_CLEAR) {
                        for (const key in this._data) {
                            this.setItem(key, undefined, false);
                        }
                    }
                }
                catch (err) {
                    console.error("store 通信出错");
                }
            }
        });
        WebStore.rpc({ method: RpcMethod.REQ_GET_DATA })
    }

    private static rpc(message: IRpcMessage) {
        debuglog(`发送 ${JSON.stringify(message)}`);
        localStorage.setItem(Rpc, JSON.stringify(message));
        localStorage.removeItem(Rpc);
    }
}