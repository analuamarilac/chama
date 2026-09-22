import { CheckCircle2 } from "lucide-react";

import coralMark from "#/assets/brand/simbolo-coral.png";

import type { CourierEmptyStateProps } from "./types.ts";

/**
 * P03: os dois vazios do entregador.
 *
 * "Nunca chegou nada" precisa prometer que a tela vai avisar — por isso a marca
 * aparece no lugar de um ícone genérico de caixa vazia: quem espera precisa
 * confiar no canal. "Você atendeu tudo" é o oposto: confirmação de trabalho
 * concluído. Um vazio genérico faria o entregador duvidar do app, e duvidar do
 * app é o que o traz de volta para o telefone pessoal.
 */
function CourierEmptyState({
	hasNeverReceivedRequest,
}: CourierEmptyStateProps) {
	if (hasNeverReceivedRequest) {
		return (
			<div className="flex flex-col items-center gap-5 px-6 py-16 text-center">
				<img src={coralMark} alt="" className="h-16 w-auto" />

				<div className="flex flex-col gap-2">
					<h2 className="font-heading font-bold text-foreground text-xl">
						Nenhuma solicitação por enquanto
					</h2>
					<p className="text-muted-foreground text-sm leading-relaxed">
						Quando uma loja solicitar contato, você verá a notificação aqui.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-5 px-6 py-16 text-center">
			<span className="flex size-16 items-center justify-center rounded-full bg-status-attended-surface text-status-attended">
				<CheckCircle2 aria-hidden="true" className="size-8" />
			</span>

			<div className="flex flex-col gap-2">
				<h2 className="font-heading font-bold text-foreground text-xl">
					Tudo em dia
				</h2>
				<p className="text-muted-foreground text-sm leading-relaxed">
					Você atendeu todas as solicitações abertas. As concluídas ficam no
					histórico.
				</p>
			</div>
		</div>
	);
}

export { CourierEmptyState };
