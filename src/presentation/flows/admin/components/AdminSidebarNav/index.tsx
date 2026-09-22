import { Link } from "@tanstack/react-router";
import { ClipboardList, Settings, Truck } from "lucide-react";

import { Routes } from "#/presentation/constants/routes.ts";

import type { AdminSidebarNavProps } from "./types.ts";

const NavItems = [
	{ to: Routes.Admin, icon: ClipboardList, label: "Solicitações", exact: true },
	{
		to: Routes.AdminEntregadores,
		icon: Truck,
		label: "Entregadores",
		exact: false,
	},
	{
		to: Routes.AdminConfiguracoes,
		icon: Settings,
		label: "Configurações",
		exact: false,
	},
] as const;

/**
 * Navegação do painel.
 *
 * O estado ativo vem do `data-status` que o Link do TanStack Router aplica
 * sozinho — os padrões do projeto pedem data-attributes no lugar de estado.
 */
function AdminSidebarNav({ onNavigate }: AdminSidebarNavProps) {
	return (
		<nav aria-label="Seções do painel" className="flex flex-col gap-1">
			{NavItems.map(({ to, icon: Icon, label, exact }) => (
				<Link
					key={to}
					to={to}
					activeOptions={{ exact }}
					onClick={onNavigate}
					className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-brand-cream/70 text-sm transition-colors hover:bg-white/10 hover:text-brand-cream focus-visible:outline-2 focus-visible:outline-brand-coral focus-visible:outline-offset-2 data-[status=active]:bg-white/12 data-[status=active]:text-brand-cream"
				>
					<Icon aria-hidden="true" className="size-4 shrink-0" />
					{label}
				</Link>
			))}
		</nav>
	);
}

export { AdminSidebarNav };
