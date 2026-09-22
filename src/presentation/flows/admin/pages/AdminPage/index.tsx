import { CheckCircle2, Clock3, Inbox, RefreshCw, SearchX } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import type { ContactRequest } from "#/domain/chama/types.ts";
import { EmptyState } from "#/presentation/components/chama/EmptyState/index.tsx";

import { RequestDetailsSheet } from "./components/RequestDetailsSheet/index.tsx";
import { RequestsFilters } from "./components/RequestsFilters/index.tsx";
import { RequestsTable } from "./components/RequestsTable/index.tsx";
import { SummaryTile } from "./components/SummaryTile/index.tsx";
import { useAdminRequests } from "./hooks/useAdminRequests.ts";

function AdminPage() {
	const {
		filteredRequests,
		totalCount,
		pendingCount,
		attendedCount,
		unreadCount,
		hasActiveFilters,
		statusFilter,
		searchTerm,
		periodFrom,
		periodTo,
		sortOrder,
		isLoading,
		isRefreshing,
		isError,
		refetch,
		handleStatusChange,
		handleSearchChange,
		handlePeriodChange,
		handleSortToggle,
		handleClearFilters,
	} = useAdminRequests();

	// Estado de UI efêmero: qual solicitação está aberta na gaveta de detalhes.
	const [detailedRequest, setDetailedRequest] = useState<ContactRequest | null>(
		null,
	);

	const hasNoRequestsAtAll = totalCount === 0;
	const hasNoResults = filteredRequests.length === 0 && !hasNoRequestsAtAll;
	const unreadHint =
		unreadCount === 0
			? "Todas já visualizadas pelo entregador"
			: `${unreadCount} ainda não ${unreadCount === 1 ? "visualizada" : "visualizadas"}`;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="flex flex-col gap-1">
					<h1 className="font-heading font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
						Solicitações
					</h1>
					<p className="text-muted-foreground text-sm">
						Todos os pedidos de contato entre lojas parceiras e entregadores.
					</p>
				</div>

				<Button
					type="button"
					variant="outline"
					onClick={() => refetch()}
					disabled={isRefreshing}
					className="h-10 gap-2"
				>
					<RefreshCw
						aria-hidden="true"
						className={isRefreshing ? "size-4 animate-spin" : "size-4"}
					/>
					{isRefreshing ? "Atualizando..." : "Atualizar"}
				</Button>
			</div>

			<div className="grid gap-3 sm:grid-cols-3">
				<SummaryTile icon={Inbox} label="Total" value={totalCount} />
				<SummaryTile
					icon={Clock3}
					label="Pendentes"
					value={pendingCount}
					tone="pending"
					hint={unreadHint}
				/>
				<SummaryTile
					icon={CheckCircle2}
					label="Atendidas"
					value={attendedCount}
					tone="attended"
					hint="Contato confirmado pelo entregador"
				/>
			</div>

			{isError ? (
				<Alert variant="destructive">
					<AlertTitle>Não foi possível carregar as solicitações</AlertTitle>
					<AlertDescription className="flex flex-col items-start gap-3">
						<span>Verifique sua conexão e tente novamente.</span>
						<Button type="button" variant="outline" onClick={() => refetch()}>
							Tentar novamente
						</Button>
					</AlertDescription>
				</Alert>
			) : null}

			{isLoading && !isError ? <Skeleton className="h-96 rounded-xl" /> : null}

			{!isLoading && !isError ? (
				<div className="flex flex-col gap-4">
					<RequestsFilters
						statusFilter={statusFilter}
						searchTerm={searchTerm}
						periodFrom={periodFrom}
						periodTo={periodTo}
						sortOrder={sortOrder}
						onStatusChange={handleStatusChange}
						onSearchChange={handleSearchChange}
						onPeriodChange={handlePeriodChange}
						onSortToggle={handleSortToggle}
					/>

					{hasNoRequestsAtAll ? (
						<EmptyState
							icon={Inbox}
							title="Nenhuma solicitação ainda"
							description="Assim que uma loja pedir contato, a solicitação aparece nesta lista."
						/>
					) : null}

					{hasNoResults ? (
						<EmptyState
							icon={SearchX}
							title="Nenhuma solicitação encontrada"
							description="Nenhum registro corresponde aos filtros aplicados."
							action={
								hasActiveFilters ? (
									<Button
										type="button"
										variant="outline"
										onClick={handleClearFilters}
									>
										Limpar filtros
									</Button>
								) : null
							}
						/>
					) : null}

					{filteredRequests.length > 0 ? (
						<>
							<RequestsTable
								requests={filteredRequests}
								onOpenDetails={setDetailedRequest}
							/>
							<p className="text-muted-foreground text-xs">
								Exibindo {filteredRequests.length} de {totalCount}{" "}
								{totalCount === 1 ? "solicitação" : "solicitações"}.
							</p>
						</>
					) : null}
				</div>
			) : null}

			<RequestDetailsSheet
				request={detailedRequest}
				onOpenChange={(isOpen) => {
					if (!isOpen) {
						setDetailedRequest(null);
					}
				}}
			/>
		</div>
	);
}

export default AdminPage;
