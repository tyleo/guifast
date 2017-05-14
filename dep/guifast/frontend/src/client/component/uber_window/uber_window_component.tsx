import React from "guifast_shared/node_module/react";
import { getWindowId } from "guifast/client";
import { UberWindowCss, UberWindowProps } from "guifast/client/component";
import { Component, fromRequireInfo, State, UberPanelState } from "guifast_shared";

function renderUberPanel(state: State, uberPanelId: number) {
    const uberPanelState = state.uberPanelsState.items[uberPanelId]!;

    const result = new Array<any>();
    if (uberPanelState.component === undefined) {
        for (const childUberPanelId of uberPanelState.children) {
            result.push(renderUberPanel(state, childUberPanelId));
        }
    } else {
        const componentInfo = uberPanelState.component;
        const component = fromRequireInfo<Component>(componentInfo);
        result.push(
            <div style={{ height: "100%", width: "100%" }} key={ uberPanelId }>{ component(state) }</div>
        );
    }
    return result;
};

export const UberWindowComponent = (props: UberWindowProps) => {
    if (props.state.isInitialized) {
        const uberWindowState = props.state.uberWindowsState.items[getWindowId()]!;
        return (
            <div style={ new UberWindowCss() }>
                { renderUberPanel(props.state, uberWindowState.uberPanelId) }
            </div>
        );
    } else {
        return (<noscript/>);
    }
}
