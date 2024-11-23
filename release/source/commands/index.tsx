import React, { useContext, useEffect, useState } from "react";
import { Text } from "ink";
import zod from "zod";
import VersionRepository from "../repositories/VersionRepository.js";
import { cliDirectoryAtom } from "../atoms/global.js";
import { useAtom, useAtomValue } from "jotai";

export const options = zod.object({
	name: zod.string().default("Stranger").describe("Name"),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({}: Props) {
	const cliDirectory = useAtomValue(cliDirectoryAtom);
	// const appContext = useContext(AppContext);
	// const versionRepository = new VersionRepository(appContext.cliDirectory);
	// const result = useAsyncGenerator(versionRepository.applyVersion(true, true));

	// const applyVersion = useCallback(versionRepository.applyVersion, ["kerk"]);
	// const result = useForAwaitOf(versionRepository.applyVersion(true, true));

	// useEffect(() => {
	// 	(async () => {
	// 		for await (const message of versionRepository.applyVersion(true, true)) {
	// 			setData((prev) => [...prev, message]);
	// 		}
	// 	})();
	// }, []);

	return <Text>The cliDirectory is: {cliDirectory}</Text>;
}

// function useAsyncGenerator(thing: AsyncGenerator) {
// 	const [data, setData] = useState<string>("");

// 	useEffect(() => {
// 		(async () => {
// 			for await (const message of thing) {
// 				// setData((prev) => [...prev, message as string]);
// 				setData(message as string);
// 			}
// 		})();
// 	}, []);

// 	return data;
// }
