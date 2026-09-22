import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const baseUrl = import.meta.env.VITE_BASE_URL || "/";

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		basepath: baseUrl,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
