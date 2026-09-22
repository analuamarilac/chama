import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AdminShell } from "#/presentation/flows/admin/components/AdminShell/index.tsx";

function AdminLayout() {
	return (
		<AdminShell>
			<Outlet />
		</AdminShell>
	);
}

const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

export { Route };
