// Overriding console methods to write to stderr instead of stdout
// to make sure the response that we send on stdout is clean.
function overrideConsoleMethods() {
	const consoleMethods = ["log", "warn", "error", "info", "debug"];

	consoleMethods.forEach((method) => {
		Object.defineProperty(console, method, {
			value: function (message?: any) {
				process.stderr.write(`${message}\n`);
			},
			writable: true,
			configurable: true,
		});
	});
}

overrideConsoleMethods();

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function execute() {
	console.error("Starting release version...");
	await sleep(1000);
	console.error("This is an error message");

	await sleep(2000);
	const data = {
		version: "1.0.0",
		name: "MyApp",
	};
	process.stdout.write(JSON.stringify(data) + "\n");
}

execute();
