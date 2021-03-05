import { DebuffAction } from "@mtgoo/ctool";
import React from "react";
import { mapAppStoreToProps } from "../../__internal";
/**
 * 在class组件中使用APP_STORE, 将APP_STORE的数据作为组件state使用
 */
export class ClassComp extends React.Component<{}, { xxAtt: any }> {
    private _debuffAction: DebuffAction;
    constructor(props) {
        super(props);
        this.state = {
            xxAtt: APP_STORE.xxAtt
        }
    }
    componentDidMount() {
        this._debuffAction = DebuffAction.create(() => {
            let handler = (ev: { newValue: any, oldValue: any }) => {
                this.setState({ xxAtt: ev.newValue });
            }
            APP_STORE.on("xxAtt", handler);
            return () => {
                APP_STORE.off("xxAtt", handler)
            }
        });
    }
    componentWillUnmount() {
        this._debuffAction.dispose();
    }
    render() {
        return (<div>【ClassComp】xxAtt:{this.state.xxAtt}</div>)
    }
}

/**
 * 使用提供的帮助函数使用APP_STORE
 */
@mapAppStoreToProps(["xxAtt"])
export class ClassComp2 extends React.Component<{ xxAtt?: any }> {
    render() {
        return <div>【ClassComp2】xxAtt:{this.props.xxAtt}</div>
    }
}

