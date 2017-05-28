import * as ChildProcess from "child_process";
import * as Guifast from "guifast_shared";

export class LibfloClient {
    private readonly onStdinEvent: Guifast.Event<string> = new Guifast.Event<string>();
    private readonly onStdoutEvent: Guifast.Event<string> = new Guifast.Event<string>();
    private readonly onStderrEvent: Guifast.Event<string> = new Guifast.Event<string>();

    private readonly onStdinOnceEvent: Guifast.EventOnce<string> = new Guifast.EventOnce<string>();
    private readonly onStdoutOnceEvent: Guifast.EventOnce<string> = new Guifast.EventOnce<string>();
    private readonly onStderrOnceEvent: Guifast.EventOnce<string> = new Guifast.EventOnce<string>();

    private readonly libfloProcess: ChildProcess.ChildProcess;

    public constructor(libfloPath: string) {
        this.libfloProcess = ChildProcess.spawn(libfloPath);
        this.libfloProcess.stdout.on(
            'data',
            (data: any) => {
                let dataString = data.toString();
                this.onStdoutEvent.call(dataString);
                this.onStdoutOnceEvent.call(dataString);
            }
        );
        this.libfloProcess.stderr.on(
            'data',
            (data: any) => {
                let dataString = data.toString();
                this.onStderrEvent.call(dataString);
                this.onStderrOnceEvent.call(dataString);
            }
        );
    }

    public get onStdin(): Guifast.ClientEvent<string> {
        return this.onStdinEvent;
    }

    public get onStdout(): Guifast.ClientEvent<string> {
        return this.onStdoutEvent;
    }

    public get onStderr(): Guifast.ClientEvent<string> {
        return this.onStderrEvent;
    }

    public get onStdinOnce(): Guifast.ClientEventOnce<string> {
        return this.onStdinOnceEvent;
    }

    public get onStdoutOnce(): Guifast.ClientEventOnce<string> {
        return this.onStdoutOnceEvent;
    }

    public get onStderrOnce(): Guifast.ClientEventOnce<string> {
        return this.onStderrOnceEvent;
    }

    public dispatch(action: Guifast.Action) {
        this.send(JSON.stringify(action));
    }

    public kill() {
        this.libfloProcess.kill();
    }

    private send(data: string) {
        this.onStdinEvent.call(data);
        this.onStdinOnceEvent.call(data);
        this.libfloProcess.stdin.write(data + "\n");
    }
}
