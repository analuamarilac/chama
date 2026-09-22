import { createFileRoute } from "@tanstack/react-router";

import SolicitantePage from "#/presentation/flows/solicitante/pages/SolicitantePage/index.tsx";

const Route = createFileRoute("/solicitante/")({
	component: SolicitantePage,
});

export { Route };
