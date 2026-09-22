import { useState } from "react";

import { ProfileShell } from "#/presentation/components/chama/ProfileShell/index.tsx";
import { PrototypeSession } from "#/presentation/constants/prototype-session.ts";
import { Routes } from "#/presentation/constants/routes.ts";
import { useCreateContactRequest } from "#/presentation/hooks/services/chama/useCreateContactRequest/index.ts";

import { ContactRequestForm } from "./components/ContactRequestForm/index.tsx";
import { RequestStatusPanel } from "./components/RequestStatusPanel/index.tsx";
import type { RequestStatusPanelState } from "./components/RequestStatusPanel/types.ts";
import type { ContactRequestSchema } from "./schema.ts";

function NovaSolicitacaoPage() {
	const { createContactRequest, createdRequest, isPending, reset } =
		useCreateContactRequest();

	/**
	 * Remonta o formulário para limpá-lo, em vez de sincronizar estado por efeito.
	 * É o padrão `key={value}` que os padrões do projeto recomendam para reset.
	 */
	const [formInstance, setFormInstance] = useState(0);

	function handleCreateAnother() {
		reset();
		setFormInstance((currentInstance) => currentInstance + 1);
	}

	// Estado derivado do próprio ciclo da mutation — sem estado local espelhado.
	function resolvePanelState(): RequestStatusPanelState {
		if (isPending) {
			return "sending";
		}

		if (createdRequest) {
			return "sent";
		}

		return "idle";
	}

	async function handleSubmit(values: ContactRequestSchema) {
		await createContactRequest(values);
	}

	return (
		<ProfileShell
			profileLabel="Solicitante"
			profileHref={Routes.Solicitante}
			pageLabel="Solicitar contato"
			userName={PrototypeSession.Solicitante.name}
			userRole={PrototypeSession.Solicitante.role}
		>
			<div className="grid items-start gap-6 lg:grid-cols-[1.15fr_1fr]">
				<section
					aria-labelledby="nova-solicitacao-title"
					className="rounded-2xl border border-border bg-card p-5 sm:p-6"
				>
					<div className="mb-6 flex flex-col gap-1.5">
						<h1
							id="nova-solicitacao-title"
							className="font-heading font-bold text-2xl text-card-foreground tracking-tight sm:text-3xl"
						>
							Solicitar contato
						</h1>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Informe os dados do pedido para que o entregador retorne o
							contato.
						</p>
					</div>

					<ContactRequestForm
						key={formInstance}
						isPending={isPending}
						isSent={Boolean(createdRequest)}
						onSubmit={handleSubmit}
					/>
				</section>

				<RequestStatusPanel
					state={resolvePanelState()}
					request={createdRequest}
					onCreateAnother={handleCreateAnother}
				/>
			</div>
		</ProfileShell>
	);
}

export default NovaSolicitacaoPage;
