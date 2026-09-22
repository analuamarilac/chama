import { createFileRoute } from "@tanstack/react-router";
import { adminSearchSchema } from "#/presentation/flows/admin/pages/AdminPage/hooks/useAdminRequests.ts";
import AdminPage from "#/presentation/flows/admin/pages/AdminPage/index.tsx";

const Route = createFileRoute("/admin/")({
	component: AdminPage,
	// P02: a rota é a dona do contrato da URL; o schema vem do hook da página.
	validateSearch: adminSearchSchema,
});

export { Route };
