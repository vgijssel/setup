import React, { useContext, useEffect } from "react";
import { Text } from "ink";
import zod from "zod";
import VersionRepository from "../repositories/VersionRepository.js";
import { AppContext } from "./_app.js";

export const options = zod.object({
	name: zod.string().default("Stranger").describe("Name"),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({ options }: Props) {
	const appContext = useContext(AppContext);

	useEffect(() => {
		const run = async () => {
			const versionRepository = new VersionRepository(appContext.cliDirectory);
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
