import React from "guifast_shared/node_module/react";
import ReactRedux from "guifast_shared/node_module/react_redux";
import * as Guifast from "guifast_shared";
import * as GuifastRenderer from "guifast/renderer";
import * as GuifastShared from "guifast/shared";

function renderUberPanel(state: GuifastRenderer.GuifastRendererState, uberPanelId: number) {
    const uberPanelState = state.uberPanelStates.items[uberPanelId]!;

    const result = new Array<any>();
    if (uberPanelState.component === undefined) {
        for (const childUberPanelId of uberPanelState.children) {
            result.push(renderUberPanel(state, childUberPanelId));
        }
    } else {
        const componentInfo = uberPanelState.component;
        const component = GuifastShared.fromRequireInfo<Guifast.Component>(componentInfo);
        result.push(
            <div style={{ height: "100%", width: "100%" }} key={ uberPanelId }>{ component(state) }</div>
        );
    }
    return result;
};

const UberWindowComponent = (props: GuifastRenderer.UberWindowProps) => {
    if (props.state.isInitialized) {
        const uberWindowState = props.state.uberWindowStates.items[GuifastRenderer.getWindowId()]!;
        return (
            <div style={ new GuifastRenderer.UberWindowCss() }>
                { renderUberPanel(props.state, uberWindowState.uberPanelId) }
            </div>
        );
    } else {
        return (<noscript/>);
    }
}

const mapStateToProps = (state: GuifastRenderer.GuifastRendererState): GuifastRenderer.UberWindowProps => {
    if (!state) {
        state = GuifastRenderer.rootRendererReducer(undefined, undefined);
    }

    return { state: state };
};

export const UberWindowContainer = ReactRedux.connect(
    mapStateToProps
)(UberWindowComponent);
