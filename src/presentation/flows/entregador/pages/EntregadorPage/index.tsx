import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { MockedCourier } from "#/domain/chama/services/seed.ts";
import {
	type ContactRequest,
	ContactRequestStatus,
} from "#/domain/chama/types.ts";
import { PhoneMockup } from "#/presentation/components/chama/PhoneMockup/index.tsx";
import { useListContactRequests } from "#/presentation/hooks/services/chama/useListContactRequests/index.ts";
import { useMarkContactRequestAsAttended } from "#/presentation/hooks/services/chama/useMarkContactRequestAsAttended/index.ts";
import { useMarkContactRequestAsViewed } from "#/presentation/hooks/services/chama/useMarkContactRequestAsViewed/index.ts";

import { CourierAppHeader } from "./components/CourierAppHeader/index.tsx";
import { CourierContextPanel } from "./components/CourierContextPanel/index.tsx";
import { CourierEmptyState } from "./components/CourierEmptyState/index.tsx";
import { CourierRequestCard } from "./components/CourierRequestCard/index.tsx";
import { NewRequestBanner } from "./components/NewRequestBanner/index.tsx";

const SKELETON_ITEMS = ["first", "second"] as const;

function sortByNewest(requests: ContactRequest[]) {
	return [...requests].sort(
		(first, second) =>
			new Date(second.createdAt).getTime() -
			new Date(first.createdAt).getTime(),
	);
}

function EntregadorPage() {
	const { contactRequests, isLoading, isError, refetch } =
		useListContactRequests();
	const { markAsAttended, attendingRequestId } =
		useMarkContactRequestAsAttended();
	const { markAsViewed } = useMarkContactRequestAsViewed();

	// Estado derivado, calculado no render — nunca em efeito.
	// O entregador só enxerga a própria caixa de entrada: o mock tem outros
	// entregadores para dar volume ao painel da operação, mas eles não são dele.
	const myRequests = contactRequests.filter(
		(request) => request.courierId === MockedCourier.id,
	);
	const pendingRequests = sortByNewest(
		myRequests.filter(
			(request) => request.status === ContactRequestStatus.Pending,
		),
	);
	const attendedRequests = sortByNewest(
		myRequests.filter(
			(request) => request.status === ContactRequestStatus.Attended,
		),
	);
	const unreadRequests = pendingRequests.filter(
		(request) => request.viewedAt === null,
	);
	const hasNeverReceivedRequest = myRequests.length === 0;

	/**
	 * P01: acionar o contato registra a visualização.
	 *
	 * No desenho anterior o gatilho era abrir o card. Aqui o card já mostra tudo,
	 * então o primeiro engajamento deliberado com a solicitação é tocar em
	 * "Entrar em contato". É evento de usuário, tratado no handler.
	 */
	function handleContact(requestId: string) {
		const request = myRequests.find((current) => current.id === requestId);

		if (!request) {
			return;
		}

		const wasAlreadyViewed = request.viewedAt !== null;

		if (wasAlreadyViewed) {
			return;
		}

		markAsViewed(request.id);
	}

	async function handleMarkAsAttended(requestId: string) {
		try {
			await markAsAttended(requestId);
		} catch {
			// O hook já notifica o erro; o card permanece para nova tentativa.
		}
	}

	const courierApp = (
		<div className="flex min-h-full flex-col bg-background">
			<CourierAppHeader />

			<div className="flex flex-1 flex-col gap-4 px-4 py-4">
				{/*
				 * Título da página para leitores de tela. Visualmente o contexto já
				 * vem do cabeçalho do app, mas a tela não pode ficar sem h1.
				 */}
				<h1 className="sr-only">Solicitações de contato</h1>

				{unreadRequests.length > 0 ? (
					<NewRequestBanner
						unreadCount={unreadRequests.length}
						latestCreatedAt={unreadRequests[0].createdAt}
					/>
				) : null}

				{isError ? (
					<Alert variant="destructive">
						<AlertTitle>Não foi possível carregar</AlertTitle>
						<AlertDescription className="flex flex-col items-start gap-3">
							<span>Verifique sua conexão e tente novamente.</span>
							<Button type="button" variant="outline" onClick={() => refetch()}>
								Tentar novamente
							</Button>
						</AlertDescription>
					</Alert>
				) : null}

				{isLoading && !isError
					? SKELETON_ITEMS.map((item) => (
							<Skeleton key={item} className="h-64 rounded-xl" />
						))
					: null}

				{!isLoading && !isError && pendingRequests.length === 0 ? (
					<CourierEmptyState
						hasNeverReceivedRequest={hasNeverReceivedRequest}
					/>
				) : null}

				{!isLoading && !isError && pendingRequests.length > 0
					? pendingRequests.map((request) => (
							<CourierRequestCard
								key={request.id}
								request={request}
								isAttending={attendingRequestId === request.id}
								onContact={handleContact}
								onMarkAsAttended={handleMarkAsAttended}
							/>
						))
					: null}

				{!isLoading && !isError && attendedRequests.length > 0 ? (
					<section
						aria-labelledby="courier-history"
						className="flex flex-col gap-3 pt-2"
					>
						<h2
							id="courier-history"
							className="font-medium text-muted-foreground text-xs uppercase tracking-wide"
						>
							Histórico
						</h2>

						{attendedRequests.map((request) => (
							<CourierRequestCard
								key={request.id}
								request={request}
								isAttending={false}
								onContact={handleContact}
								onMarkAsAttended={handleMarkAsAttended}
							/>
						))}
					</section>
				) : null}
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-background lg:bg-secondary/40">
			<div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:px-6 lg:py-14">
				<CourierContextPanel />

				<PhoneMockup label="Aplicativo do entregador, visto em um celular">
					{courierApp}
				</PhoneMockup>
			</div>
		</div>
	);
}

export default EntregadorPage;
