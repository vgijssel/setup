import childProcess from "node:child_process";
// import type Buffer from "node:buffer";
import { join } from "path";

export default class VersionRepository {
	cliDirectory: string;
	releaseVersionFile: string;

	constructor(cliDirectory: string) {
		this.cliDirectory = cliDirectory;
		this.releaseVersionFile = join(cliDirectory, "utils", "release-version.js");
	}

	async applyVersion(dryRun: boolean, verbose: boolean): Promise<void> {
		// console.log("Applying version...");
		console.log("Dry run: ", dryRun);
		console.log("Verbose: ", verbose);

		// const currentWorkingDirectory = process.cwd();
		// console.log("Current working directory: ", currentWorkingDirectory);
		// console.log("Current CLI directory: " + this.cliDirectory);

		const subProcess = childProcess.spawn("node", [this.releaseVersionFile]);

		subProcess.stdout.on("data", (data: Buffer) => {
			console.log("stdout");
			// process.stdout.write(data.toString());
			console.log(data.toString());
		});

		subProcess.stderr.on("data", (data: Buffer) => {
			console.log("stderr");
			// process.stdout.write(data.toString());
			console.log(data.toString());
		});

		subProcess.on("close", (code: number) => {
			console.log(`child process exited with code ${code}`);
		});
	}
}

// - print stderr into separate flexbox component
