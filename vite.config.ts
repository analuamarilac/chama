import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { xprintsInspectorPlugin } from "./vite-plugin-xprints-inspector";

// O padrão precisa ser "/" e não "": com base vazia o Vite emite caminhos
// relativos ("./assets/..."), que a partir de uma rota aninhada como
// /solicitante/nova resolvem para /solicitante/assets/... e caem no rewrite de
// SPA, quebrando a aplicação em produção. O `basepath` do router (src/router.tsx)
// já usava "/" como padrão — isto apenas alinha os dois.
const baseUrl = process.env.VITE_BASE_URL || "/";

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
