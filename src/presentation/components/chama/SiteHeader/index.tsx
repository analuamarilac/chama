import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Logo } from "#/presentation/components/brand/Logo/index.tsx";
import { HelpDialog } from "#/presentation/components/chama/HelpDialog/index.tsx";
import { Brand } from "#/presentation/constants/brand.ts";
import { Routes } from "#/presentation/constants/routes.ts";

import type { SiteHeaderProps } from "./types.ts";

/** Cabeçalho das páginas institucionais do protótipo (Início e Sobre). */
function SiteHeader({ hideAboutLink = false }: SiteHeaderProps) {
	return (
		<header className="border-border/60 border-b">
			<div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
				<div className="flex items-center gap-3">
					<Link
						to={Routes.Home}
						className="rounded-md focus-visible:outline-2 focus-visible:outline-brand-coral focus-visible:outline-offset-4"
					>
						<Logo variant="full" size="sm" />
					</Link>

					<Badge
						variant="outline"
						className="border-border bg-card text-muted-foreground"
					>
						Protótipo funcional
					</Badge>
				</div>

				<nav
					aria-label="Navegação do protótipo"
					className="flex items-center gap-1"
				>
					{hideAboutLink ? null : (
						<Button variant="ghost" size="sm" asChild>
							<Link to={Routes.Sobre}>Sobre o Chama</Link>
						</Button>
					)}

					<HelpDialog />

					<Button variant="outline" size="sm" asChild className="gap-1.5">
						<a
							href={Brand.authorPortfolioUrl}
							target="_blank"
							rel="noreferrer noopener"
						>
							{Brand.authorName}
							<ArrowUpRight aria-hidden="true" className="size-3.5" />
							<span className="sr-only">(abre o portfólio em nova aba)</span>
						</a>
					</Button>
				</nav>
			</div>
		</header>
	);
}

export { SiteHeader };
