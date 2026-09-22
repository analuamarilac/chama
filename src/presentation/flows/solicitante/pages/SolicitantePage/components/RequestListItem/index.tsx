import { CheckCheck, Eye, Send } from "lucide-react";

import { ContactRequestStatus } from "#/domain/chama/types.ts";
import { StatusBadge } from "#/presentation/components/chama/StatusBadge/index.tsx";
import {
	formatDateTime,
	formatRelativeTime,
} from "#/presentation/utils/datetime.ts";

import type { RequestListItemProps } from "./types.ts";

/**
 * Linha da listagem do Solicitante.
 *
 * Mostra o andamento do lado de quem espera: enviada, vista pelo entregador e
 * atendida. Saber que a solicitação foi *vista* é o que evita a ligação de
 * cobrança no meio do caminho — que é justamente o hábito que o produto combate.
 */
function RequestListItem({ request }: RequestListItemProps) {
	const isPending = request.status === ContactRequestStatus.Pending;
	const wasViewed = request.viewedAt !== null;

	return (
		<article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:p-5">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="flex min-w-0 flex-col gap-1">
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="font-heading font-semibold text-card-foreground text-base">
							{request.orderCode}
						</h3>
						<span className="text-muted-foreground text-xs">
							Protocolo {request.id}
						</span>
					</div>
					<p className="text-muted-foreground text-xs">
						Enviada {formatRelativeTime(request.createdAt)}
					</p>
				</div>

				<StatusBadge status={request.status} pendingLabel="Em andamento" />
			</div>

			<p className="text-foreground text-sm leading-relaxed">
				{request.message}
			</p>

			<ol className="flex flex-col gap-2 border-border border-t pt-3">
				<li className="flex items-center gap-2 text-muted-foreground text-xs">
					<Send aria-hidden="true" className="size-3.5 shrink-0" />
					Enviada em {formatDateTime(request.createdAt)}
				</li>

				<li className="flex items-center gap-2 text-muted-foreground text-xs">
					<Eye aria-hidden="true" className="size-3.5 shrink-0" />
					{wasViewed
						? `Vista pelo entregador em ${formatDateTime(request.viewedAt)}`
						: "Ainda não vista pelo entregador"}
				</li>

				<li className="flex items-center gap-2 text-xs">
					<CheckCheck
						aria-hidden="true"
						className={
							isPending
								? "size-3.5 shrink-0 text-muted-foreground"
								: "size-3.5 shrink-0 text-status-attended"
						}
					/>
					<span
						className={
							isPending
								? "text-muted-foreground"
								: "font-medium text-status-attended"
						}
					>
						{isPending
							? "Aguardando o retorno do entregador"
							: `Contato realizado em ${formatDateTime(request.attendedAt)}`}
					</span>
				</li>
			</ol>
		</article>
	);
}

export { RequestListItem };
