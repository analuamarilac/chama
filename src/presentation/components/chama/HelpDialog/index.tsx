import { CircleHelp, TriangleAlert } from "lucide-react";

import { Button } from "#/components/ui/button.tsx";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog.tsx";

import type { HelpDialogProps } from "./types.ts";

const TestSteps = [
	"Abra a visão Solicitante e envie um pedido de contato. Guarde o protocolo.",
	"Vá para o Entregador: a solicitação aparece marcada como Nova e o contador sobe.",
	"Toque no card para ver o telefone da loja e a mensagem — isso registra a visualização.",
	"Clique em “Falei com a loja”. A solicitação sai de Pendentes e vai para o Histórico.",
	"Abra o Admin: o status agora é Atendida, com data e hora. Teste o filtro e a busca.",
] as const;

/**
 * Ajuda para quem está avaliando o protótipo.
 *
 * O aviso de aba única não é um detalhe: os dados vivem em memória e o estado
 * pertence ao documento do navegador, então abrir os perfis em abas separadas
 * cria estados independentes e o fluxo entre eles não se comunica.
 */
function HelpDialog({ open, onOpenChange }: HelpDialogProps = {}) {
	const isControlled = open !== undefined;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{isControlled ? null : (
				<DialogTrigger asChild>
					<Button variant="ghost" size="sm" className="gap-1.5">
						<CircleHelp aria-hidden="true" className="size-4" />
						Ajuda
					</Button>
				</DialogTrigger>
			)}

			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="font-heading">
						Como testar o protótipo
					</DialogTitle>
					<DialogDescription>
						Um roteiro curto para percorrer o fluxo completo entre os três
						perfis.
					</DialogDescription>
				</DialogHeader>

				<div className="flex gap-3 rounded-lg border border-status-pending/30 bg-status-pending-surface p-3">
					<TriangleAlert
						aria-hidden="true"
						className="mt-0.5 size-4 shrink-0 text-status-pending"
					/>
					<p className="text-foreground text-sm leading-relaxed">
						Faça o teste{" "}
						<strong className="font-semibold">em uma única aba</strong>. Os
						dados ficam em memória durante a sessão: abrir os perfis em abas
						separadas cria estados independentes que não se comunicam.
					</p>
				</div>

				<ol className="flex flex-col gap-3">
					{TestSteps.map((step, index) => (
						<li key={step} className="flex gap-3">
							<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-navy font-heading font-semibold text-brand-cream text-xs">
								{index + 1}
							</span>
							<span className="text-muted-foreground text-sm leading-relaxed">
								{step}
							</span>
						</li>
					))}
				</ol>
			</DialogContent>
		</Dialog>
	);
}

export { HelpDialog };
