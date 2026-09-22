import { Link } from "@tanstack/react-router";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb.tsx";
import { Logo } from "#/presentation/components/brand/Logo/index.tsx";
import { HelpDialog } from "#/presentation/components/chama/HelpDialog/index.tsx";
import { SessionMenu } from "#/presentation/components/chama/SessionMenu/index.tsx";
import { Routes } from "#/presentation/constants/routes.ts";

import { profileShellStyles } from "./styles.ts";
import type { ProfileShellProps } from "./types.ts";

/**
 * Casca comum das três telas de perfil.
 *
 * RN09 continua valendo: o que se repete aqui é o cabeçalho do protótipo,
 * nunca conteúdo de um perfil dentro de outro.
 *
 * Toda navegação usa `Link` do TanStack Router de propósito: a navegação
 * client-side preserva o estado em memória do serviço mockado. Um `<a href>`
 * comum recarregaria a página e reiniciaria os dados (H06).
 */
function ProfileShell({
	profileLabel,
	profileHref,
	pageLabel,
	userName,
	userRole,
	headerAction,
	width,
	children,
}: ProfileShellProps) {
	const { root, header, headerInner, main } = profileShellStyles({ width });
	const hasChildPage = Boolean(pageLabel);
	const canLinkToProfileRoot = hasChildPage && Boolean(profileHref);

	return (
		<div className={root()}>
			<header className={header()}>
				<div className={headerInner()}>
					<div className="flex min-w-0 items-center gap-3">
						<Link
							to={Routes.Home}
							className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-brand-coral focus-visible:outline-offset-4"
						>
							<Logo variant="full" size="sm" />
							<span className="sr-only">Chama — voltar ao início</span>
						</Link>

						<span
							aria-hidden="true"
							className="hidden h-5 w-px bg-border sm:block"
						/>

						<Breadcrumb className="hidden min-w-0 sm:block">
							<BreadcrumbList>
								<BreadcrumbItem>
									{canLinkToProfileRoot && profileHref ? (
										<BreadcrumbLink asChild>
											<Link to={profileHref}>{profileLabel}</Link>
										</BreadcrumbLink>
									) : (
										<BreadcrumbPage>{profileLabel}</BreadcrumbPage>
									)}
								</BreadcrumbItem>

								{hasChildPage ? (
									<>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											<BreadcrumbPage>{pageLabel}</BreadcrumbPage>
										</BreadcrumbItem>
									</>
								) : null}
							</BreadcrumbList>
						</Breadcrumb>
					</div>

					<div className="flex shrink-0 items-center gap-1">
						{headerAction}
						<HelpDialog />
						<SessionMenu userName={userName} userRole={userRole} />
					</div>
				</div>
			</header>

			<main className={main()}>{children}</main>
		</div>
	);
}

export { ProfileShell };
