class Test {
    private readonly fn: { (): [boolean, any | undefined] };
    private readonly testName: string;

    public constructor(fn: { (): [boolean, any | undefined] }, testName: string) {
        this.fn = fn;
        this.testName = testName;
    }

    public get Fn(): { (): [boolean, any | undefined] } {
        return this.fn;
    }

    public get TestName(): string {
        return this.testName;
    }
}

export default Test;
