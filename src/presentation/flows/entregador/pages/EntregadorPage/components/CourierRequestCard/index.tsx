import { Check, Loader2, MessageSquareText, Phone, User } from "lucide-react";

import { Button } from "#/components/ui/button.tsx";
import { ContactRequestStatus } from "#/domain/chama/types.ts";
import { RequesterContact } from "#/presentation/components/chama/RequesterContact/index.tsx";
import { StatusBadge } from "#/presentation/components/chama/StatusBadge/index.tsx";
import { formatDateTime } from "#/presentation/utils/datetime.ts";

import type { CourierRequestCardProps } from "./types.ts";

/** Remove a formatação para montar o link `tel:`. */
function toDialableNumber(phone: string) {
	return phone.replace(/[^+\d]/g, "");
}

function CourierRequestCard({
	request,
	isAttending,
	onContact,
	onMarkAsAttended,
}: CourierRequestCardProps) {
	const isPending = request.status === ContactRequestStatus.Pending;

	return (
		<article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="text-muted-foreground text-xs">Código do pedido</p>
					<p className="font-heading font-bold text-foreground text-xl">
						{request.orderCode}
					</p>
				</div>

				<StatusBadge status={request.status} />
			</div>

			<div className="flex flex-col gap-3">
				<div className="flex items-start gap-3">
					<User
						aria-hidden="true"
						className="mt-0.5 size-4 shrink-0 text-muted-foreground"
					/>
					<div className="min-w-0">
						<p className="text-muted-foreground text-xs">Solicitante</p>
						<p className="font-medium text-foreground text-sm">
							{request.requesterOperatorName}
						</p>
						<p className="text-muted-foreground text-xs">
							{request.requesterStoreName}
						</p>
					</div>
				</div>

				{/* RN07: componente dedicado ao telefone da loja. */}
				<RequesterContact
					variant="row"
					requesterPhone={request.requesterPhone}
				/>

				<div className="flex items-start gap-3">
					<MessageSquareText
						aria-hidden="true"
						className="mt-0.5 size-4 shrink-0 text-muted-foreground"
					/>
					<div className="min-w-0">
						<p className="text-muted-foreground text-xs">Mensagem</p>
						<p className="text-foreground text-sm leading-relaxed">
							{request.message}
						</p>
					</div>
				</div>
			</div>

			{isPending ? (
				<div className="flex flex-col gap-2">
					<Button
						asChild
						className="h-11 w-full gap-2 bg-brand-navy text-brand-cream hover:bg-brand-navy/90"
					>
						<a
							href={`tel:${toDialableNumber(request.requesterPhone)}`}
							onClick={() => onContact(request.id)}
						>
							<Phone aria-hidden="true" className="size-4" />
							Entrar em contato
						</a>
					</Button>

					<Button
						type="button"
						variant="outline"
						onClick={() => onMarkAsAttended(request.id)}
						disabled={isAttending}
						className="h-11 w-full gap-2"
					>
						{isAttending ? (
							<Loader2 aria-hidden="true" className="size-4 animate-spin" />
						) : (
							<Check aria-hidden="true" className="size-4" />
						)}
						{isAttending ? "Registrando..." : "Marcar como atendida"}
					</Button>
				</div>
			) : (
				<p className="border-border border-t pt-3 text-muted-foreground text-xs">
					Atendida em {formatDateTime(request.attendedAt)}
				</p>
			)}
		</article>
	);
}

export { CourierRequestCard };
