import React, { useEffect } from "react";
import { Text } from "ink";
import zod from "zod";
// import { releaseVersion } from "nx/release/index.js";
import VersionRepository from "../repositories/VersionRepository.js";

export const options = zod.object({
	name: zod.string().default("Stranger").describe("Name"),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({ options }: Props) {
	useEffect(() => {
		const run = async () => {
			const versionRepository = new VersionRepository();
			const result = await versionRepository.applyVersion(true, true);
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
