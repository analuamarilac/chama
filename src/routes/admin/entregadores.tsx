import { createFileRoute } from "@tanstack/react-router";

import AdminCouriersPage from "#/presentation/flows/admin/pages/AdminCouriersPage/index.tsx";

const Route = createFileRoute("/admin/entregadores")({
	component: AdminCouriersPage,
});

export { Route };
