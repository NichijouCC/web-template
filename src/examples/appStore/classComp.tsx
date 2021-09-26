import { DebuffAction } from "@mtgoo/ctool";
import React from "react";
import { mapAppStoreToProps } from "../../__internal/index";
/**
 * 在class组件中使用APP_STORE, 将APP_STORE的数据作为组件state使用
 */
export class ClassComp extends React.Component<{}, { stored_att: any }> {
    private _debuffAction: DebuffAction;
    constructor(props) {
        super(props);
        this.state = {
            stored_att: APP_STORE.stored_att
        }
    }
    componentDidMount() {
        this._debuffAction = DebuffAction.create(() => {
            let handler = (ev: { newValue: any, oldValue: any }) => {
                this.setState({ stored_att: ev.newValue });
            }
            APP_STORE.on("stored_att", handler);
            return () => {
                APP_STORE.off("stored_att", handler)
            }
        });
    }
    componentWillUnmount() {
        this._debuffAction.dispose();
    }
    render() {
        return (<div>
            <div>【ClassComp】stored_att:{this.state.stored_att}</div>
        </div>)
    }
}

/**
 * 使用提供的帮助函数使用APP_STORE
 */
@mapAppStoreToProps(["stored_att"])
export class ClassComp2 extends React.Component<{ stored_att?: any }> {
    render() {
        return <div>【ClassComp2】stored_att:{this.props.stored_att}</div>
    }
}

