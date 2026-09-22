import { LayoutDashboard, Store, Truck } from "lucide-react";

import { SiteFooter } from "#/presentation/components/chama/SiteFooter/index.tsx";
import { SiteHeader } from "#/presentation/components/chama/SiteHeader/index.tsx";
import { Routes } from "#/presentation/constants/routes.ts";

import { ProfileCard } from "./components/ProfileCard/index.tsx";

const Profiles = [
	{
		to: Routes.Solicitante,
		icon: Store,
		title: "Solicitante",
		description: "Peça contato com o entregador",
		isPrimary: true,
	},
	{
		to: Routes.Entregador,
		icon: Truck,
		title: "Entregador",
		description: "Receba e atenda solicitações",
		isPrimary: false,
	},
	{
		to: Routes.Admin,
		icon: LayoutDashboard,
		title: "Admin",
		description: "Acompanhe toda a operação",
		isPrimary: false,
	},
] as const;

function HomePage() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<SiteHeader />

			{/* `justify-center` evita o vazio grande entre os cartões e o rodapé
			    quando a tela é alta: o conteúdo é curto de propósito. */}
			<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
				<div className="flex max-w-2xl flex-col gap-3">
					<h1 className="font-heading font-bold text-3xl text-foreground leading-[1.15] tracking-tight sm:text-5xl">
						Contato rápido,
						<br />
						protegido e rastreável.
					</h1>
					<p className="text-lg text-muted-foreground">
						Escolha uma visão para testar o fluxo completo.
					</p>
				</div>

				<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Profiles.map((profile) => (
						<ProfileCard key={profile.to} {...profile} />
					))}
				</div>
			</main>

			<SiteFooter />
		</div>
	);
}

export default HomePage;
