import React, { useContext, useEffect, useState } from "react";
import { Box, Text } from "ink";
import zod from "zod";
import VersionRepository from "../repositories/VersionRepository.js";
import { cliDirectoryAtom } from "../atoms/global.js";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { StatusMessage } from "@inkjs/ui";
import { Task, TaskList } from "ink-task-list";
import spinners from "cli-spinners";

export const options = zod.object({
	name: zod.string().default("Stranger").describe("Name"),
});

type Props = {
	options: zod.infer<typeof options>;
};

// create list of 3 items
// start them all as pending
// start the first one spinning
// when the first one is done, start the second one spinning
// when the second one is done, start the third one spinning
//
// 1. Checking
// 2. Generating version
// 3. Generating changelog

const kerkAtom = atom({
	check: "pending",
	version: "pending",
	changelog: "pending",
});

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const mutateAtom = atom(null, async (get, set, key: string, value: string) => {
	set(kerkAtom, (prev) => ({ ...prev, [key]: value }));
});

const logAtom = atom(null, async (get, set, random: string) => {
	console.log("KERK" + random);
});

const runAllAtom = atom(null, async (get, set) => {
	await set(mutateAtom, "check", "loading");
	await sleep(1000);
	await set(mutateAtom, "check", "success");
	await set(mutateAtom, "version", "loading");
	await sleep(1000);
	await set(mutateAtom, "version", "success");
	await set(mutateAtom, "changelog", "loading");
	await sleep(1000);
	await set(mutateAtom, "changelog", "success");
});

// const fullMutateAtom = atom(null, async (get, set, key: string, value: string) => {
// }

export default function Index({}: Props) {
	const cliDirectory = useAtomValue(cliDirectoryAtom);
	const kerk = useAtomValue(kerkAtom);
	const runAll = useSetAtom(runAllAtom);

	useEffect(() => {
		runAll();
	}, []);

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
	return (
		<>
			<TaskList>
				<Task label="Check" state={kerk.check as any} spinner={spinners.dots} />
				<Task
					label="Versioning"
					state={kerk.version as any}
					spinner={spinners.dots}
				/>
				<Task
					label="Writing Changelog"
					state={kerk.changelog as any}
					spinner={spinners.dots}
				/>
			</TaskList>
		</>
	);
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
