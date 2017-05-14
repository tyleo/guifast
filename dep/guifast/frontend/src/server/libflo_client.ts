import * as ChildProcess from "child_process";
import { Action, ClientEvent, ClientEventOnce, Event, EventOnce, Fn1 } from "guifast_shared";

export class LibfloClient {
    private readonly onStdinEvent: Event<string> = new Event<string>();
    private readonly onStdoutEvent: Event<string> = new Event<string>();
    private readonly onStderrEvent: Event<string> = new Event<string>();

    private readonly onStdinOnceEvent: EventOnce<string> = new EventOnce<string>();
    private readonly onStdoutOnceEvent: EventOnce<string> = new EventOnce<string>();
    private readonly onStderrOnceEvent: EventOnce<string> = new EventOnce<string>();

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

    public get onStdin(): ClientEvent<string> {
        return this.onStdinEvent;
    }

    public get onStdout(): ClientEvent<string> {
        return this.onStdoutEvent;
    }

    public get onStderr(): ClientEvent<string> {
        return this.onStderrEvent;
    }

    public get onStdinOnce(): ClientEventOnce<string> {
        return this.onStdinOnceEvent;
    }

    public get onStdoutOnce(): ClientEventOnce<string> {
        return this.onStdoutOnceEvent;
    }

    public get onStderrOnce(): ClientEventOnce<string> {
        return this.onStderrOnceEvent;
    }

    public dispatch(action: Action) {
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
