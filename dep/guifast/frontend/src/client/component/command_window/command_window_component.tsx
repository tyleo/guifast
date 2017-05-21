import React from "guifast_shared/node_module/react";
import { CommandWindowLineCss, CommandWindowCss } from "guifast/client/component";
import { CommandWindowState } from "guifast/client/state";

import * as Guifast from "guifast_shared";

const onKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const target = e.currentTarget as HTMLParagraphElement;
        let text = target.innerText;
        target.innerText = "";

        text = text.trim();

        Guifast.sendToMain(Guifast.Command.make(text));
    }
};

const renderPreviousLines = (previousLines: Array<string>) => {
    const result = new Array<any>();
    let i = 0;
    for (const line of previousLines) {
        result.push(<p key={ i } style={ new CommandWindowLineCss() }>{ line }</p>);
        i++;
    }
    return result;
};

export const CommandWindowComponent = (state: CommandWindowState) => (
    <div
        style={ new CommandWindowCss() }>
        { renderPreviousLines(state.previousLines) }
        <p
            contentEditable={ true }
            onKeyDown={ e => onKeyDown(e) }
            style={ new CommandWindowLineCss() }/>
    </div>
);
