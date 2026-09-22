import { createFileRoute } from "@tanstack/react-router";

import NovaSolicitacaoPage from "#/presentation/flows/solicitante/pages/NovaSolicitacaoPage/index.tsx";

const Route = createFileRoute("/solicitante/nova")({
	component: NovaSolicitacaoPage,
});

export { Route };
