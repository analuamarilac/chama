import { Copy, Eye, MoreHorizontal, ShieldCheck, Store } from "lucide-react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table.tsx";
import { ContactRequestStatus } from "#/domain/chama/types.ts";
import { StatusBadge } from "#/presentation/components/chama/StatusBadge/index.tsx";
import { OriginChannelLabel } from "#/presentation/constants/channel-labels.ts";
import {
	formatShortDateTime,
	formatTime,
} from "#/presentation/utils/datetime.ts";

import type { RequestsTableProps } from "./types.ts";

async function copyToClipboard(value: string, successMessage: string) {
	try {
		await navigator.clipboard.writeText(value);
		toast.success(successMessage);
	} catch {
		toast.error("Não foi possível copiar", {
			description: "Seu navegador bloqueou o acesso à área de transferência.",
		});
	}
}

function RequestsTable({ requests, onOpenDetails }: RequestsTableProps) {
	return (
		<div className="overflow-x-auto rounded-xl border border-border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Código</TableHead>
						<TableHead>Solicitante</TableHead>
						{/*
						 * RN07: as duas colunas de telefone convivem na mesma linha —
						 * é aqui que a confusão aconteceria, então é aqui que a
						 * diferenciação precisa ser mais explícita.
						 */}
						<TableHead>Contato</TableHead>
						<TableHead>Entregador</TableHead>
						<TableHead>Telefone interno</TableHead>
						<TableHead>Canal</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Data</TableHead>
						<TableHead className="w-10">
							<span className="sr-only">Ações</span>
						</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{requests.map((request) => {
						const isPending = request.status === ContactRequestStatus.Pending;
						const viewedLabel = request.viewedAt
							? `Visualizada às ${formatTime(request.viewedAt)}`
							: "Ainda não visualizada";

						return (
							<TableRow key={request.id}>
								<TableCell className="whitespace-nowrap">
									<span className="font-heading font-semibold text-foreground">
										{request.orderCode}
									</span>
									<span className="block text-muted-foreground text-xs">
										{request.id}
									</span>
								</TableCell>

								<TableCell className="whitespace-nowrap">
									<span className="font-medium text-foreground">
										{request.requesterStoreName}
									</span>
									<span className="block text-muted-foreground text-xs">
										{request.requesterOperatorName}
									</span>
								</TableCell>

								<TableCell className="whitespace-nowrap">
									<span className="flex items-center gap-2">
										<Store
											aria-hidden="true"
											className="size-4 shrink-0 text-muted-foreground"
										/>
										<span className="text-foreground">
											{request.requesterPhone}
										</span>
									</span>
									<span className="sr-only">Telefone do solicitante</span>
								</TableCell>

								<TableCell className="whitespace-nowrap text-foreground">
									{request.courierName}
								</TableCell>

								<TableCell className="whitespace-nowrap">
									<span className="flex w-fit items-center gap-2 rounded-md border border-border border-dashed bg-muted/40 px-2 py-1">
										<ShieldCheck
											aria-hidden="true"
											className="size-4 shrink-0 text-brand-navy dark:text-brand-cream"
										/>
										<span className="text-muted-foreground">
											{request.courierPhoneInternal}
										</span>
									</span>
									<span className="sr-only">
										Linha interna de {request.courierName}, restrita à operação
									</span>
								</TableCell>

								<TableCell className="whitespace-nowrap">
									<span className="rounded-md bg-secondary px-2 py-0.5 text-secondary-foreground text-xs">
										{OriginChannelLabel[request.originChannel]}
									</span>
								</TableCell>

								<TableCell>
									<div className="flex flex-col gap-1">
										<StatusBadge status={request.status} />
										{/* Acompanha o que mudou na visão do Entregador. */}
										{isPending ? (
											<span className="whitespace-nowrap text-muted-foreground text-xs">
												{viewedLabel}
											</span>
										) : null}
									</div>
								</TableCell>

								<TableCell className="whitespace-nowrap text-muted-foreground text-sm">
									{formatShortDateTime(request.createdAt)}
								</TableCell>

								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label={`Ações do pedido ${request.orderCode}`}
											>
												<MoreHorizontal aria-hidden="true" className="size-4" />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent align="end" className="w-52">
											<DropdownMenuItem
												onSelect={() => onOpenDetails(request)}
												className="gap-2"
											>
												<Eye aria-hidden="true" className="size-4" />
												Ver detalhes
											</DropdownMenuItem>

											<DropdownMenuSeparator />

											<DropdownMenuItem
												onSelect={() =>
													copyToClipboard(request.id, "Protocolo copiado")
												}
												className="gap-2"
											>
												<Copy aria-hidden="true" className="size-4" />
												Copiar protocolo
											</DropdownMenuItem>

											<DropdownMenuItem
												onSelect={() =>
													copyToClipboard(
														request.requesterPhone,
														"Telefone da loja copiado",
													)
												}
												className="gap-2"
											>
												<Store aria-hidden="true" className="size-4" />
												Copiar telefone da loja
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

export { RequestsTable };
