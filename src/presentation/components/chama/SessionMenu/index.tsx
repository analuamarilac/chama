import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, ChevronDown } from "lucide-react";

import { Button } from "#/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import { Routes } from "#/presentation/constants/routes.ts";

import type { SessionMenuProps } from "./types.ts";

/**
 * Chip de sessão do cabeçalho.
 *
 * RN08: não existe login neste MVP. A identidade é simulada e o menu diz isso
 * com todas as letras — sem esse aviso, um avatar com nome sugere autenticação
 * que o protótipo não tem. É também onde vive a troca de perfil, que é um
 * recurso de avaliação e não do produto.
 */
function SessionMenu({ userName, userRole }: SessionMenuProps) {
	const initial = userName.trim().charAt(0).toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="gap-2 pl-1">
					<span
						aria-hidden="true"
						className="flex size-6 items-center justify-center rounded-full bg-brand-navy font-heading font-semibold text-[0.7rem] text-brand-cream"
					>
						{initial}
					</span>
					<span className="hidden sm:inline">{userName}</span>
					<ChevronDown aria-hidden="true" className="size-3.5 opacity-60" />
					<span className="sr-only">Abrir menu da sessão simulada</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-64">
				<DropdownMenuLabel className="flex flex-col gap-0.5">
					<span className="font-heading">{userName}</span>
					<span className="font-normal text-muted-foreground text-xs">
						{userRole}
					</span>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<p className="px-2 py-1.5 text-muted-foreground text-xs leading-relaxed">
					Sessão simulada. Este protótipo não tem login — o perfil é escolhido
					na tela inicial, apenas para avaliação.
				</p>

				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<Link to={Routes.Home} className="gap-2">
						<ArrowLeftRight aria-hidden="true" className="size-4" />
						Trocar de perfil
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export { SessionMenu };
