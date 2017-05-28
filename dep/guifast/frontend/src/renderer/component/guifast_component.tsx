import React from "guifast_shared/node_module/react";
import ReactRedux from "guifast_shared/node_module/react_redux";
import * as GuifastRenderer from "guifast/renderer";

export const GuifastComponent = () => (
    <ReactRedux.Provider store={ GuifastRenderer.getRootStore() }>
        <GuifastRenderer.UberWindowContainer/>
    </ReactRedux.Provider>
);
