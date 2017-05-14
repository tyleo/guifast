import ReactRedux from "guifast_shared/node_module/react_redux";
import { reducer, State } from "guifast_shared";
import { UberWindowComponent } from "guifast/client/component/uber_window/uber_window_component";
import { UberWindowProps } from "guifast/client/component";

const mapStateToProps = (state: State): UberWindowProps => {
    if (!state) {
        state = reducer(undefined, undefined);
    }

    return { state: state };
};

export const UberWindowContainer = ReactRedux.connect(
    mapStateToProps
)(UberWindowComponent);
