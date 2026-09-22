import { Link } from "@tanstack/react-router";
import { BellRing, Check, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "#/components/ui/button.tsx";
import { Routes } from "#/presentation/constants/routes.ts";

import { requestStatusPanelStyles } from "./styles.ts";
import type { RequestStatusPanelProps } from "./types.ts";

const PanelMedia = {
	idle: ShieldCheck,
	sending: Loader2,
	sent: Check,
} as const;

/**
 * Painel de acompanhamento ao lado do formulário.
 *
 * Ocupa o mesmo espaço nos três estados de propósito: o layout não salta
 * quando a solicitação é enviada, e quem está preenchendo já enxerga desde o
 * começo o que vai acontecer depois.
 *
 * `aria-live` anuncia a mudança para leitores de tela — sem isso, quem não vê
 * a tela não saberia que o envio foi concluído.
 */
function RequestStatusPanel({
	state,
	request,
	onCreateAnother,
}: RequestStatusPanelProps) {
	const styles = requestStatusPanelStyles({ state });
	const MediaIcon = PanelMedia[state];
	const isSent = state === "sent" && Boolean(request);

	return (
		<aside aria-live="polite" className={styles.root()}>
			<span className={styles.media()}>
				<MediaIcon
					aria-hidden="true"
					className={state === "sending" ? "size-6 animate-spin" : "size-6"}
					strokeWidth={2.5}
				/>
			</span>

			{state === "idle" ? (
				<div className="flex flex-col gap-2">
					<h2 className={styles.title()}>O contato fica registrado</h2>
					<p className="text-muted-foreground text-sm leading-relaxed">
						Ao enviar, o entregador recebe uma notificação no app da WeFind com
						o seu recado. A operação acompanha o atendimento — e o telefone
						pessoal dele nunca é exposto.
					</p>
				</div>
			) : null}

			{state === "sending" ? (
				<div className="flex flex-col gap-2">
					<h2 className={styles.title()}>Enviando solicitação</h2>
					<p className="text-muted-foreground text-sm leading-relaxed">
						Registrando o pedido e notificando o entregador.
					</p>
				</div>
			) : null}

			{isSent && request ? (
				<div className="flex w-full flex-col items-center gap-4">
					<div className="flex flex-col gap-2">
						<h2 className={styles.title()}>Solicitação enviada</h2>
						<p className="font-medium text-muted-foreground text-sm">
							O entregador foi notificado.
						</p>
					</div>

					<p className="text-muted-foreground text-sm leading-relaxed">
						Assim que ele entrar em contato, você receberá a ligação em seu
						número.
					</p>

					<dl className="flex w-full flex-col gap-2 rounded-xl border border-status-attended/20 bg-card/70 p-3 text-left">
						<div className="flex items-center justify-between gap-3">
							<dt className="text-muted-foreground text-xs">Protocolo</dt>
							<dd className="font-heading font-semibold text-foreground text-sm">
								{request.id}
							</dd>
						</div>
						<div className="flex items-center justify-between gap-3">
							<dt className="text-muted-foreground text-xs">Situação</dt>
							<dd className="font-medium text-status-pending text-sm">
								Em andamento
							</dd>
						</div>
						<div className="flex items-center justify-between gap-3">
							<dt className="text-muted-foreground text-xs">Notificação</dt>
							<dd className="flex items-center gap-1.5 font-medium text-foreground text-sm">
								<BellRing
									aria-hidden="true"
									className="size-3.5 text-brand-coral-text"
								/>
								Push no app
							</dd>
						</div>
					</dl>

					<div className="flex w-full flex-col gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={onCreateAnother}
							className="w-full bg-card"
						>
							Fazer outra solicitação
						</Button>

						<Button variant="ghost" size="sm" asChild>
							<Link to={Routes.Solicitante}>Ver minhas solicitações</Link>
						</Button>
					</div>
				</div>
			) : null}
		</aside>
	);
}

export { RequestStatusPanel };
