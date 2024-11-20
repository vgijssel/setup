export default class VersionRepository {
	cliDirectory: string;

	constructor(cliDirectory: string) {
		this.cliDirectory = cliDirectory;
	}

	async applyVersion(dryRun: boolean, verbose: boolean): Promise<void> {
		console.log("Applying version...");
		console.log("Dry run: ", dryRun);
		console.log("Verbose: ", verbose);

		const currentWorkingDirectory = process.cwd();
		console.log("Current working directory: ", currentWorkingDirectory);
		console.log("Current CLI directory: " + this.cliDirectory);
	}
}

// - find a way to call the method
// - print stderr into separate flexbox component
