import React, { ReactNode } from "react";
import type { AppProps } from "pastel";
import { createContext } from "react";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Provider, WritableAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { cliDirectoryAtom } from "../atoms/global.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliDirectory = dirname(__dirname);

function AtomsHydrator({
	atomValues,
	children,
}: {
	atomValues: Iterable<
		readonly [WritableAtom<unknown, [any], unknown>, unknown]
	>;
	children: ReactNode;
}) {
	useHydrateAtoms(new Map(atomValues));
	return children;
}

export default function App({ Component, commandProps }: AppProps) {
	return (
		<Provider>
			<AtomsHydrator atomValues={[[cliDirectoryAtom, cliDirectory]]}>
				<Component {...commandProps} />
			</AtomsHydrator>
		</Provider>
	);
}
