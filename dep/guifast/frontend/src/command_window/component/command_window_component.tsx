import React from "guifast_shared/node_module/react";
import * as CommandWindow from "guifast/command_window";
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
        result.push(<p key={ i } style={ new CommandWindow.CommandWindowLineCss() }>{ line }</p>);
        i++;
    }
    return result;
};

export const CommandWindowComponent = (state: CommandWindow.CommandWindowState) => (
    <div
        style={ new CommandWindow.CommandWindowCss() }>
        { renderPreviousLines(state.previousLines) }
        <p
            contentEditable={ true }
            onKeyDown={ e => onKeyDown(e) }
            style={ new CommandWindow.CommandWindowLineCss() }/>
    </div>
);
