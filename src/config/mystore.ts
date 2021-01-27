import { Att, MyStore } from '../__internal';

/**
 * 项目自定义的数据中心
 */
@MyStore
export class Mystore {
    @Att
    authInfo: IauthInfo;
}

/**
 * 登录后的一些数据存储起来,例如：token
 */
export interface IauthInfo {
    token: string;
}