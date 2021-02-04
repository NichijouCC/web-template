import { Att, MyStore } from '../__internal';

/**
 * APP_STORE 配置
 */
@MyStore
export class CustomStore {
    //-----------------------------------------------------
    //                  项目需要的共享数据定义在这里
    //----------------------------------------------------
    @Att
    authInfo: IauthInfo;
}

/**
 * 数据中心的自定义事件
 */
export interface IcustomStoreEvents {
    //-----------------------------------------------------
    //                  项目需要的事件定义在这里
    //-----------------------------------------------------
    xx: void;
}

/**
 * 登录后的一些数据存储起来,例如：token
 */
export interface IauthInfo {
    token: string;
}