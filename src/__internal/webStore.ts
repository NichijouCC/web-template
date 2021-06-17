import { debuglog } from "./util";
import { EventEmitter, EventTarget } from "@mtgoo/ctool"
/**
 * 有事件的sessionStorage
 */
export class WebStore extends EventEmitter<{ "webStore:set": { prop: string, newValue: any, oldValue: any } }> {
    private _data: any = {};
    private static privateStore = "__webStore:data";
    private static storeSetEvent = "__webStore:set";
    private static req_storeGetEvent = "__webStore:get_request";
    private static resp_storeGetEvent = "__webStore:get_response";
    private static storeRemoveEvent = "__webStore:remove";
    private static storeRefCount = "__webStore:refCount";
    setItem = (key: string, value: any) => {
        this._data[key] = value;
        sessionStorage.setItem(WebStore.privateStore, JSON.stringify(this._data));
        WebStore.raiseEvent(WebStore.storeSetEvent, { key, value });
        debuglog(`【store】：set ${key} ${value}`);
    }
    getItem = (key: string) => {
        return this._data[key];
    }

    removeItem = (key: string) => {
        this._data[key] = undefined;
        sessionStorage.setItem(WebStore.privateStore, JSON.stringify(this._data));
        WebStore.raiseEvent(WebStore.storeRemoveEvent, key);
        debuglog(`【store】：remove ${key}`);
    }
    clear = () => {
        for (const key in this._data) {
            this._data[key] = undefined;
        }
        sessionStorage.removeItem(WebStore.privateStore);
        sessionStorage.removeItem(WebStore.storeSetEvent);
        sessionStorage.removeItem(WebStore.storeRemoveEvent);

        debuglog(`【store】：clear`);
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
            if (ev.key == null && ev.newValue == null) {
                debuglog(`【store】：其他界面clear data`, ev);
                //clear
                for (const key in this._data) {
                    this._data[key] = undefined;
                }
            } else {
                if (ev.key == WebStore.req_storeGetEvent) {
                    WebStore.raiseEvent(WebStore.resp_storeGetEvent, initData);
                    debuglog(`【store】：其他界面请求store数据 ${ev.newValue}`, ev);
                }
                else if (ev.key == WebStore.resp_storeGetEvent) {
                    let data = JSON.parse(ev.newValue);
                    for (let key in data) {
                        this._data[key] = data[key];
                    }
                }
                else if (ev.key == WebStore.storeSetEvent && ev.newValue != null) {
                    let data = JSON.parse(ev.newValue);
                    debuglog(`【store】：其他界面set ${ev.newValue}`, ev);
                    if (data.key != null && data.value != null) {
                        this._data[data.key] = data.value;
                    }
                } else if (ev.key == WebStore.storeRemoveEvent && ev.newValue != null) {
                    debuglog(`【store】：其他界面remove ${ev.newValue}`, ev);
                    let key = JSON.parse(ev.newValue);
                    this._data[key] = undefined;
                }
                // else if (ev.key == WebStore.storeRefCount) {
                //     debuglog(`【store】：refCount= ${sessionStorage.getItem(WebStore.storeRefCount)}`, ev);
                // }
            }
        });
        WebStore.raiseEvent(WebStore.req_storeGetEvent, new Date().toLocaleString())

    }
    static raiseEvent(topic: string, data: any) {
        localStorage.setItem(topic, JSON.stringify(data));
        localStorage.removeItem(topic);
    }
}