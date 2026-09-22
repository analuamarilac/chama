import { BellRing, Smartphone, SquareArrowOutUpRight } from "lucide-react";

import { MockedCourier } from "#/domain/chama/services/seed.ts";

const Points = [
	{
		icon: Smartphone,
		title: "Mobile-first",
		description:
			"O entregador resolve isso em movimento, com uma mão. A tela é desenhada para o celular e apresentada aqui na moldura real de 390px.",
	},
	{
		icon: BellRing,
		title: "A notificação é um estado, não um aviso que some",
		description:
			"A faixa de nova solicitação permanece até ser lida. Um toast só apareceria para quem estivesse com a tela aberta no instante do envio.",
	},
	{
		icon: SquareArrowOutUpRight,
		title: "O telefone pessoal não circula",
		description:
			"O entregador liga para a loja pelo app. A linha interna dele existe, mas só a operação enxerga.",
	},
] as const;

/**
 * Painel explicativo ao lado da moldura, só no desktop.
 *
 * Não faz parte do produto: existe para que quem avalia entenda por que esta
 * tela é a única apresentada em moldura de celular.
 */
function CourierContextPanel() {
	return (
		<aside className="hidden max-w-md flex-col gap-6 lg:flex">
			<div className="flex flex-col gap-2">
				<h1 className="font-heading font-bold text-3xl text-foreground tracking-tight">
					Experiência do entregador
				</h1>
				<p className="text-muted-foreground leading-relaxed">
					A caixa de entrada de quem está na rua: o que a loja precisa, o
					telefone para retornar e o registro do atendimento.
				</p>
			</div>

			<ul className="flex flex-col gap-4">
				{Points.map(({ icon: Icon, title, description }) => (
					<li key={title} className="flex gap-3">
						<span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-brand-navy dark:text-brand-cream">
							<Icon aria-hidden="true" className="size-4" />
						</span>
						<div className="flex flex-col gap-1">
							<p className="font-medium text-foreground text-sm">{title}</p>
							<p className="text-muted-foreground text-sm leading-relaxed">
								{description}
							</p>
						</div>
					</li>
				))}
			</ul>

			<div className="rounded-xl border border-border border-dashed bg-card/60 p-4">
				<p className="font-medium text-foreground text-sm">
					A tela começa vazia — é de propósito
				</p>
				<p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
					{MockedCourier.name} é o entregador desta sessão e inicia sem
					solicitações. Abra o perfil <strong>Solicitante</strong> pelo menu,
					envie um pedido de contato e volte: ele aparece aqui, com a
					notificação.
				</p>
			</div>
		</aside>
	);
}

export { CourierContextPanel };
