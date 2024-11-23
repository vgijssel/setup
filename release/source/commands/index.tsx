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

export default function Index({}: Props) {
	const cliDirectory = useAtomValue(cliDirectoryAtom);
	const kerk = useAtomValue(kerkAtom);
	const runAll = useSetAtom(runAllAtom);

	useEffect(() => {
		runAll();
	}, []);

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
