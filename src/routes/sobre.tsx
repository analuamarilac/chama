import { createFileRoute } from "@tanstack/react-router";

import SobrePage from "#/presentation/flows/sobre/pages/SobrePage/index.tsx";

const Route = createFileRoute("/sobre")({
	component: SobrePage,
});

export { Route };
