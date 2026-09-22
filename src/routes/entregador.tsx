import { createFileRoute } from "@tanstack/react-router";

import EntregadorPage from "#/presentation/flows/entregador/pages/EntregadorPage/index.tsx";

const Route = createFileRoute("/entregador")({
	component: EntregadorPage,
});

export { Route };
