import { Skeleton } from "#/components/ui/skeleton.tsx";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table.tsx";
import { MockedCourier, MockedCouriers } from "#/domain/chama/services/seed.ts";
import { ContactRequestStatus } from "#/domain/chama/types.ts";
import { useListContactRequests } from "#/presentation/hooks/services/chama/useListContactRequests/index.ts";

import { CourierRow } from "./components/CourierRow/index.tsx";

/**
 * Seção Entregadores do painel.
 *
 * RN02 continua valendo: esta tela é só de consulta. Não existe atribuição
 * manual de entregador — a solicitação já nasce associada no serviço mockado.
 * O que a operação precisa aqui é enxergar carga: quem está com pendências.
 */
function AdminCouriersPage() {
	const { contactRequests, isLoading } = useListContactRequests();

	// Estado derivado, calculado no render.
	function countFor(courierId: string, status: string) {
		return contactRequests.filter(
			(request) => request.courierId === courierId && request.status === status,
		).length;
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
					Entregadores
				</h1>
				<p className="text-muted-foreground text-sm">
					Carga de solicitações por entregador. A linha interna é visível apenas
					para a operação.
				</p>
			</div>

			{isLoading ? (
				<Skeleton className="h-72 rounded-xl" />
			) : (
				<div className="overflow-x-auto rounded-xl border border-border bg-card">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Entregador</TableHead>
								<TableHead>Telefone interno</TableHead>
								<TableHead>Pendentes</TableHead>
								<TableHead>Atendidas</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{MockedCouriers.map((courier) => (
								<CourierRow
									key={courier.id}
									courier={courier}
									pendingCount={countFor(
										courier.id,
										ContactRequestStatus.Pending,
									)}
									attendedCount={countFor(
										courier.id,
										ContactRequestStatus.Attended,
									)}
									isSessionCourier={courier.id === MockedCourier.id}
								/>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			<p className="text-muted-foreground text-xs leading-relaxed">
				Toda solicitação criada no protótipo é associada a{" "}
				<strong className="text-foreground">{MockedCourier.name}</strong>, que é
				o entregador da sessão (RN02). Os demais existem para dar volume
				realista à operação.
			</p>
		</div>
	);
}

export default AdminCouriersPage;
