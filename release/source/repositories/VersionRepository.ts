export default class VersionRepository {
	async applyVersion(dryRun: boolean, verbose: boolean): Promise<void> {
		console.log("Applying version...");
		console.log("Dry run: ", dryRun);
		console.log("Verbose: ", verbose);
	}
}
