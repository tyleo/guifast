import Test from "guifast_shared/util/test/test";

function RunTests(tests: Array<Test>) {
    for (const test of tests) {
        const testName = test.TestName;

        console.log("Running: " + testName);

        const testResult = test.Fn();

        let passedFailed: string;

        if (testResult[0]) {
            passedFailed = " passed";
        } else {
            passedFailed = " failed";
        }

        console.log(testName + passedFailed);

        if (testResult[1] !== undefined) {
            console.log(testResult[1]);
        }
    }
}

export default RunTests;
