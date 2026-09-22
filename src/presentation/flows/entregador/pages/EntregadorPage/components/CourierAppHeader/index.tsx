import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, CircleHelp, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import { Logo } from "#/presentation/components/brand/Logo/index.tsx";
import { HelpDialog } from "#/presentation/components/chama/HelpDialog/index.tsx";
import { PrototypeSession } from "#/presentation/constants/prototype-session.ts";
import { Routes } from "#/presentation/constants/routes.ts";

/**
 * Cabeçalho do app do entregador.
 *
 * É o único perfil com cabeçalho próprio em vez do `ProfileShell`: a tela vive
 * dentro de uma moldura de celular, onde breadcrumb e chip de sessão não
 * caberiam. O menu concentra o que o protótipo precisa oferecer.
 */
function CourierAppHeader() {
	const [isHelpOpen, setIsHelpOpen] = useState(false);

	return (
		<header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-border/60 border-b bg-background/95 px-4 py-3 backdrop-blur">
			<div className="flex min-w-0 items-center gap-2.5">
				<Logo variant="full" size="sm" className="h-5" />
				<span aria-hidden="true" className="h-4 w-px shrink-0 bg-border" />
				<span className="truncate font-medium text-foreground text-sm">
					Entregador
				</span>
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon-sm" aria-label="Abrir menu">
						<Menu aria-hidden="true" className="size-5" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-64">
					<DropdownMenuLabel className="flex flex-col gap-0.5">
						<span className="font-heading">
							{PrototypeSession.Entregador.name}
						</span>
						<span className="font-normal text-muted-foreground text-xs">
							{PrototypeSession.Entregador.role}
						</span>
					</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<p className="px-2 py-1.5 text-muted-foreground text-xs leading-relaxed">
						Sessão simulada. Este protótipo não tem login — o perfil é escolhido
						na tela inicial, apenas para avaliação.
					</p>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onSelect={(event) => {
							event.preventDefault();
							setIsHelpOpen(true);
						}}
						className="gap-2"
					>
						<CircleHelp aria-hidden="true" className="size-4" />
						Como testar
					</DropdownMenuItem>

					<DropdownMenuItem asChild>
						<Link to={Routes.Home} className="gap-2">
							<ArrowLeftRight aria-hidden="true" className="size-4" />
							Trocar de perfil
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<HelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />
		</header>
	);
}

export { CourierAppHeader };
