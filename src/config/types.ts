import { IcustomeConfig } from "./customeConfig";
import { CustomeStore, IcustomeStoreEvents } from "./customeStore";
//tip:此文件不需要修改
declare global {
    /**
     * （项目配置）自定义类型
     */
    interface IappConfig extends IcustomeConfig { }
    /**
     * (store的数据)自定义类型
     */
    interface IdataStruct extends CustomeStore { }
    /**
     * (store的事件) 自定义类型
     */
    interface IdataEvents extends IcustomeStoreEvents { }
};