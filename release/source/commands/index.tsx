import React, { useEffect } from "react";
import { Text } from "ink";
import zod from "zod";
import { releaseVersion } from "nx/release/index.js";

export const options = zod.object({
	name: zod.string().default("Stranger").describe("Name"),
});

type Props = {
	options: zod.infer<typeof options>;
};

// import the nx release packages
// run the version, changelog and publish commands with dry run
// see what happens

export default function Index({ options }: Props) {
	useEffect(() => {
		const run = async () => {
			const result = await releaseVersion({ dryRun: true, verbose: true });
			console.log(result);
		};

		run();
	}, []);

	return (
		<Text>
			Hello, <Text color="green">{options.name}</Text>
		</Text>
	);
}
