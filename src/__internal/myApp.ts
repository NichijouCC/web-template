import { ReactElement } from "react";
import ReactDOM from "react-dom";
import { internal_init } from "./appInit";
import { IstoreOption } from "./appStore";

export class MyApp {

    private static _storeOption: IstoreOption;
    static get storeOption() { return this._storeOption };

    static start = (root: ReactElement, opt?: IappOption) => {
        internal_init();
        MyApp._storeOption = opt.storeOpt;
        opt.onInit?.();
        ReactDOM.render(root, document.getElementById("root"));
    }
}


export interface IappOption {
    /**
     * 数据中心配置项
     */
    storeOpt?: IstoreOption
    /**
     * 初始话
     */
    onInit?: () => void;
}
