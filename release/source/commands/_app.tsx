import React from "react";
import type { AppProps } from "pastel";
import { createContext } from "react";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliDirectory = dirname(__dirname);

type AppState = {
	cliDirectory: string;
};

export const AppContext = createContext({} as AppState);

export default function App({ Component, commandProps }: AppProps) {
	const state: AppState = {
		cliDirectory: cliDirectory,
	};

	return (
		<AppContext.Provider value={state}>
			<Component {...commandProps} />
		</AppContext.Provider>
	);
}
