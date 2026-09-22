import { createRootRoute, Outlet } from "@tanstack/react-router";

import { Toaster } from "#/components/ui/sonner.tsx";

function RootComponent() {
	return (
		<>
			<Outlet />
			{/* Rodapé, e não topo: o cabeçalho dos perfis é fixo e o toast o cobria. */}
			<Toaster position="bottom-center" richColors />
		</>
	);
}

const Route = createRootRoute({
	component: RootComponent,
});

export { Route };
