import { IcustomConfig } from "./customConfig";
import { CustomStore, IcustomStoreEvents } from "./customStore";
//tip:此文件不需要修改
declare global {
    /**
     * （项目配置）自定义类型
     */
    interface IappConfig extends IcustomConfig { }
    /**
     * (store的数据)自定义类型
     */
    interface IstoreData extends CustomStore { }
    /**
     * (store的事件) 自定义类型
     */
    interface IdataEvents extends IcustomStoreEvents { }
};