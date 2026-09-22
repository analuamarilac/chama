import type { ContactRequestStatus } from "#/domain/chama/types.ts";

interface StatusBadgeProps {
	status: ContactRequestStatus;
	/**
	 * Substitui o rótulo de pendência. Para a operação o estado é "Pendente";
	 * para quem abriu a solicitação, "Em andamento" descreve melhor a espera.
	 */
	pendingLabel?: string;
	className?: string;
}

export type { StatusBadgeProps };
