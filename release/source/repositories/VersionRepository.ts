import childProcess from "node:child_process";
import { join } from "path";

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class VersionRepository {
	cliDirectory: string;
	releaseVersionFile: string;

	constructor(cliDirectory: string) {
		this.cliDirectory = cliDirectory;
		this.releaseVersionFile = join(cliDirectory, "utils", "release-version.js");
	}

	async *applyVersion(dryRun: boolean, verbose: boolean) {
		yield `dryRun: ${dryRun}, verbose: ${verbose}`;
		// console.log("Dry run: ", dryRun);
		// console.log("Verbose: ", verbose);
		await sleep(1000);
		yield "Starting release version...";
		await sleep(1000);
		yield "This is an error message";
		await sleep(1000);
		yield "we are done";

		// console.log("Dry run: ", dryRun);
		// console.log("Verbose: ", verbose);
		// const subProcess = childProcess.spawn("node", [this.releaseVersionFile]);
		// for await (const data of this.readStderr(subProcess)) {
		// 	yield data;
		// }
		// subProcess.on("close", (code: number) => {
		// 	console.log(`child process exited with code ${code}`);
		// });
	}

	async *readStderr(subProcess: childProcess.ChildProcess) {
		if (subProcess.stderr !== null) {
			for await (const chunk of subProcess.stderr) {
				yield chunk.toString();
			}
		}
	}
}
