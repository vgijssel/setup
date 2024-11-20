#!/usr/bin/env node --no-warnings=ExperimentalWarnin
// Added --no-warnings=ExperimentalWarnin to the shebang
// to remove:
// (node:38905) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
import Pastel from "pastel";

const app = new Pastel({
	importMeta: import.meta,
});

await app.run();
