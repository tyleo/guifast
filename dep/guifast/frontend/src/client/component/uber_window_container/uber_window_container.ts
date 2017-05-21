import ReactRedux from "guifast_shared/node_module/react_redux";
import * as Guifast from "guifast_shared";
import { UberWindowComponent } from "guifast/client/component/uber_window/uber_window_component";
import { UberWindowProps } from "guifast/client/component";

const mapStateToProps = (state: Guifast.RootRendererState): UberWindowProps => {
    if (!state) {
        state = Guifast.rootRendererReducer(undefined, undefined);
    }

    return { state: state };
};

export const UberWindowContainer = ReactRedux.connect(
    mapStateToProps
)(UberWindowComponent);
