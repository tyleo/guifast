import React from "guifast_shared/node_module/react";
import * as GuifastClient from "guifast/client";
import { UberWindowCss, UberWindowProps } from "guifast/client/component";
import * as Guifast from "guifast_shared";

function renderUberPanel(state: Guifast.RootRendererState, uberPanelId: number) {
    const uberPanelState = state.uberPanelStates.items[uberPanelId]!;

    const result = new Array<any>();
    if (uberPanelState.component === undefined) {
        for (const childUberPanelId of uberPanelState.children) {
            result.push(renderUberPanel(state, childUberPanelId));
        }
    } else {
        const componentInfo = uberPanelState.component;
        const component = Guifast.fromRequireInfo<Guifast.Component>(componentInfo);
        result.push(
            <div style={{ height: "100%", width: "100%" }} key={ uberPanelId }>{ component(state) }</div>
        );
    }
    return result;
};

export const UberWindowComponent = (props: UberWindowProps) => {
    if (props.state.isInitialized) {
        const uberWindowState = props.state.uberWindowStates.items[GuifastClient.getWindowId()]!;
        return (
            <div style={ new UberWindowCss() }>
                { renderUberPanel(props.state, uberWindowState.uberPanelId) }
            </div>
        );
    } else {
        return (<noscript/>);
    }
}
