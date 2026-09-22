import { createFileRoute } from "@tanstack/react-router";

import AdminSettingsPage from "#/presentation/flows/admin/pages/AdminSettingsPage/index.tsx";

const Route = createFileRoute("/admin/configuracoes")({
	component: AdminSettingsPage,
});

export { Route };
