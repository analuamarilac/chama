import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet.tsx";
import { Logo } from "#/presentation/components/brand/Logo/index.tsx";
import { HelpDialog } from "#/presentation/components/chama/HelpDialog/index.tsx";
import { SessionMenu } from "#/presentation/components/chama/SessionMenu/index.tsx";
import { PrototypeSession } from "#/presentation/constants/prototype-session.ts";
import { Routes } from "#/presentation/constants/routes.ts";

import { AdminSidebarNav } from "../AdminSidebarNav/index.tsx";
import type { AdminShellProps } from "./types.ts";

/**
 * Casca do painel da operação.
 *
 * O Admin é o único perfil com navegação entre seções, então ganha uma barra
 * lateral em vez do cabeçalho simples dos outros dois — é a densidade de quem
 * passa o turno inteiro na tela, não de quem entra para resolver uma coisa só.
 *
 * No mobile a barra vira uma gaveta: manter a coluna fixa comeria metade da
 * largura útil de uma tabela que já é larga.
 */
function AdminShell({ children }: AdminShellProps) {
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

	return (
		<div className="flex min-h-screen bg-background">
			<aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 bg-brand-navy px-4 py-5 lg:flex">
				<Link
					to={Routes.Home}
					className="rounded-md px-2 focus-visible:outline-2 focus-visible:outline-brand-coral focus-visible:outline-offset-4"
				>
					<Logo variant="full" tone="light" size="sm" />
					<span className="sr-only">Chama — voltar ao início</span>
				</Link>

				<AdminSidebarNav />

				<p className="mt-auto px-3 text-brand-cream/45 text-xs leading-relaxed">
					Protótipo de avaliação. Os dados vivem apenas nesta sessão.
				</p>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col">
				<header className="sticky top-0 z-20 border-border/60 border-b bg-background/95 backdrop-blur">
					<div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
						<div className="flex items-center gap-2 lg:hidden">
							<Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" aria-label="Abrir menu">
										<Menu aria-hidden="true" className="size-5" />
									</Button>
								</SheetTrigger>

								<SheetContent
									side="left"
									className="w-64 gap-6 border-none bg-brand-navy px-4 py-5"
								>
									<SheetHeader className="p-0">
										<SheetTitle className="sr-only">
											Seções do painel
										</SheetTitle>
										<Logo variant="full" tone="light" size="sm" />
									</SheetHeader>

									<AdminSidebarNav
										onNavigate={() => setIsMobileNavOpen(false)}
									/>
								</SheetContent>
							</Sheet>

							<Logo variant="full" size="sm" />
						</div>

						<div className="ml-auto flex items-center gap-1">
							<HelpDialog />
							<SessionMenu
								userName={PrototypeSession.Admin.name}
								userRole={PrototypeSession.Admin.role}
							/>
						</div>
					</div>
				</header>

				<main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-8">
					{children}
				</main>
			</div>
		</div>
	);
}

export { AdminShell };
