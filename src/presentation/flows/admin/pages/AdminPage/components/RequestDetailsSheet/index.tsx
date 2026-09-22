import { CheckCheck, Eye, Send } from "lucide-react";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "#/components/ui/sheet.tsx";
import { ContactRequestStatus } from "#/domain/chama/types.ts";
import { CourierInternalContact } from "#/presentation/components/chama/CourierInternalContact/index.tsx";
import { RequesterContact } from "#/presentation/components/chama/RequesterContact/index.tsx";
import { StatusBadge } from "#/presentation/components/chama/StatusBadge/index.tsx";
import { OriginChannelLabel } from "#/presentation/constants/channel-labels.ts";
import { formatDateTime } from "#/presentation/utils/datetime.ts";

import type { RequestDetailsSheetProps } from "./types.ts";

/**
 * Ficha completa de uma solicitação.
 *
 * A tabela é feita para varrer muitas linhas; esta gaveta é para entender uma.
 * É também onde os dois telefones aparecem com folga — cada um no seu
 * componente, com rótulo e tratamento próprios (RN07).
 */
function RequestDetailsSheet({
	request,
	onOpenChange,
}: RequestDetailsSheetProps) {
	const isOpen = request !== null;

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full gap-0 sm:max-w-md">
				{request ? (
					<>
						<SheetHeader>
							<SheetTitle className="font-heading">
								Pedido {request.orderCode}
							</SheetTitle>
							<SheetDescription>Protocolo {request.id}</SheetDescription>
						</SheetHeader>

						<div className="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
							<StatusBadge status={request.status} />

							<div className="rounded-lg bg-muted/50 p-4">
								<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
									Mensagem da loja
								</p>
								<p className="mt-2 text-foreground text-sm leading-relaxed">
									{request.message}
								</p>
							</div>

							<div className="flex flex-col gap-3">
								<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
									Solicitante
								</p>
								<p className="font-medium text-foreground text-sm">
									{request.requesterStoreName}
									<span className="ml-2 font-normal text-muted-foreground">
										{request.requesterOperatorName}
									</span>
								</p>
								{/* RN07 */}
								<RequesterContact requesterPhone={request.requesterPhone} />
							</div>

							{/* RN07: o par do componente acima, com tratamento distinto. */}
							<CourierInternalContact
								courierName={request.courierName}
								courierPhoneInternal={request.courierPhoneInternal}
							/>

							<dl className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1">
									<dt className="text-muted-foreground text-xs">
										Canal de origem
									</dt>
									<dd className="font-medium text-foreground text-sm">
										{OriginChannelLabel[request.originChannel]}
									</dd>
								</div>
								<div className="flex flex-col gap-1">
									<dt className="text-muted-foreground text-xs">Notificação</dt>
									<dd className="font-medium text-foreground text-sm">
										Push no app
									</dd>
								</div>
							</dl>

							<div className="flex flex-col gap-3 border-border border-t pt-4">
								<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
									Linha do tempo
								</p>

								<ol className="flex flex-col gap-2.5">
									<li className="flex items-center gap-2 text-sm">
										<Send
											aria-hidden="true"
											className="size-4 shrink-0 text-muted-foreground"
										/>
										<span className="text-muted-foreground">
											Criada em {formatDateTime(request.createdAt)}
										</span>
									</li>

									<li className="flex items-center gap-2 text-sm">
										<Eye
											aria-hidden="true"
											className="size-4 shrink-0 text-muted-foreground"
										/>
										<span className="text-muted-foreground">
											{request.viewedAt
												? `Vista pelo entregador em ${formatDateTime(request.viewedAt)}`
												: "Ainda não visualizada pelo entregador"}
										</span>
									</li>

									<li className="flex items-center gap-2 text-sm">
										<CheckCheck
											aria-hidden="true"
											className={
												request.status === ContactRequestStatus.Attended
													? "size-4 shrink-0 text-status-attended"
													: "size-4 shrink-0 text-muted-foreground"
											}
										/>
										<span
											className={
												request.status === ContactRequestStatus.Attended
													? "font-medium text-status-attended"
													: "text-muted-foreground"
											}
										>
											{request.attendedAt
												? `Atendida em ${formatDateTime(request.attendedAt)}`
												: "Aguardando atendimento"}
										</span>
									</li>
								</ol>
							</div>
						</div>
					</>
				) : null}
			</SheetContent>
		</Sheet>
	);
}

export { RequestDetailsSheet };
