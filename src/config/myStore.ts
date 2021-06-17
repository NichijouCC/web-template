import { AppStore } from '../__internal';

/**
 * APP_STORE 配置
 */
@AppStore.MyStore
export class CustomStore {
    //-----------------------------------------------------
    //                  项目需要的共享数据定义在这里
    //----------------------------------------------------
    @AppStore.Serialize
    authInfo: IAuthInfo;

    @AppStore.Serialize
    xxAtt: any;

    confirmBox: {
        beActive: boolean,
        data?: {
            title: string,
            onOk?: () => void,
            content?: React.ReactNode
        }
    } = { beActive: false, data: null };
}

/**
 * APP_STORE的自定义事件
 */
export interface ICustomStoreEvents {
    //-----------------------------------------------------
    //                  项目需要的事件定义在这里
    //-----------------------------------------------------
    xx: void;
}

/**
 * 登录后的一些数据存储起来,例如：token
 */
export interface IAuthInfo {
    token: string;
}