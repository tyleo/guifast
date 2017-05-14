import React from "guifast_shared/node_module/react";
import ReactRedux from "guifast_shared/node_module/react_redux";
import { getRootStore } from "guifast/client";
import { UberWindowContainer } from "guifast/client/component";

export const GuifastComponent = () => (
    <ReactRedux.Provider store={ getRootStore() }>
        <UberWindowContainer/>
    </ReactRedux.Provider>
);
