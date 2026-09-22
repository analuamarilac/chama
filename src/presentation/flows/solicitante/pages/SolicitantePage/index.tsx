import { Link } from "@tanstack/react-router";
import { Inbox, Plus, RefreshCw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { MockedRequester } from "#/domain/chama/services/seed.ts";
import {
	type ContactRequest,
	ContactRequestStatus,
} from "#/domain/chama/types.ts";
import { EmptyState } from "#/presentation/components/chama/EmptyState/index.tsx";
import { ProfileShell } from "#/presentation/components/chama/ProfileShell/index.tsx";
import { PrototypeSession } from "#/presentation/constants/prototype-session.ts";
import { Routes } from "#/presentation/constants/routes.ts";
import { useListContactRequests } from "#/presentation/hooks/services/chama/useListContactRequests/index.ts";

import { RequestListItem } from "./components/RequestListItem/index.tsx";

const SKELETON_ITEMS = ["first", "second"] as const;

function sortByNewest(requests: ContactRequest[]) {
	return [...requests].sort(
		(first, second) =>
			new Date(second.createdAt).getTime() -
			new Date(first.createdAt).getTime(),
	);
}

function SolicitantePage() {
	const { contactRequests, isLoading, isRefreshing, isError, refetch } =
		useListContactRequests();

	// Estado derivado, calculado no render.
	// Cada loja enxerga apenas as próprias solicitações: as do seed pertencem a
	// outras lojas, então esta listagem começa vazia de propósito.
	const requests = sortByNewest(
		contactRequests.filter(
			(request) => request.requesterId === MockedRequester.id,
		),
	);
	const openCount = requests.filter(
		(request) => request.status === ContactRequestStatus.Pending,
	).length;
	const hasRequests = requests.length > 0;

	return (
		<ProfileShell
			profileLabel="Solicitante"
			pageLabel="Minhas solicitações"
			profileHref={Routes.Solicitante}
			userName={PrototypeSession.Solicitante.name}
			userRole={PrototypeSession.Solicitante.role}
		>
			<div className="flex flex-col gap-6">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="flex flex-col gap-1.5">
						<h1 className="font-heading font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
							Minhas solicitações
						</h1>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{openCount === 0
								? "Acompanhe aqui os pedidos de contato com entregadores."
								: `${openCount} ${openCount === 1 ? "solicitação aguardando" : "solicitações aguardando"} retorno do entregador.`}
						</p>
					</div>

					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => refetch()}
							disabled={isRefreshing}
							aria-label="Atualizar lista"
						>
							<RefreshCw
								aria-hidden="true"
								className={isRefreshing ? "size-4 animate-spin" : "size-4"}
							/>
						</Button>

						<Button asChild className="h-10 gap-2">
							<Link to={Routes.SolicitanteNova}>
								<Plus aria-hidden="true" className="size-4" />
								Nova solicitação
							</Link>
						</Button>
					</div>
				</div>

				{isError ? (
					<Alert variant="destructive">
						<AlertTitle>Não foi possível carregar suas solicitações</AlertTitle>
						<AlertDescription className="flex flex-col items-start gap-3">
							<span>Verifique sua conexão e tente novamente.</span>
							<Button type="button" variant="outline" onClick={() => refetch()}>
								Tentar novamente
							</Button>
						</AlertDescription>
					</Alert>
				) : null}

				{isLoading && !isError ? (
					<div className="flex flex-col gap-3">
						{SKELETON_ITEMS.map((item) => (
							<Skeleton key={item} className="h-44 rounded-xl" />
						))}
					</div>
				) : null}

				{!isLoading && !isError && !hasRequests ? (
					<EmptyState
						icon={Inbox}
						title="Nenhuma solicitação ainda"
						description="Quando precisar falar com o entregador de um pedido, abra uma solicitação de contato. Ela fica registrada aqui, com o andamento do atendimento."
						action={
							<Button asChild className="gap-2">
								<Link to={Routes.SolicitanteNova}>
									<Plus aria-hidden="true" className="size-4" />
									Nova solicitação
								</Link>
							</Button>
						}
					/>
				) : null}

				{!isLoading && !isError && hasRequests ? (
					<div className="flex flex-col gap-3">
						{requests.map((request) => (
							<RequestListItem key={request.id} request={request} />
						))}
					</div>
				) : null}
			</div>
		</ProfileShell>
	);
}

export default SolicitantePage;
