import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { xprintsInspectorPlugin } from "./vite-plugin-xprints-inspector";

const baseUrl = process.env.VITE_BASE_URL || "";

const config = defineConfig({
	base: baseUrl,
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		viteReact(),
		xprintsInspectorPlugin(),
	],
	server: {
		port: 5173,
		allowedHosts: true,
		cors: {
			origin: true,
			credentials: true,
		},
	},
});

export default config;
