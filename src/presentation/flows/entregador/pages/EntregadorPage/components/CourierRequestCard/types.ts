import type { ContactRequest } from "#/domain/chama/types.ts";

interface CourierRequestCardProps {
	request: ContactRequest;
	/** `true` enquanto a mutation de atendimento desta solicitação está em voo. */
	isAttending: boolean;
	/** P01: registra a visualização quando o entregador aciona o contato. */
	onContact: (requestId: string) => void;
	onMarkAsAttended: (requestId: string) => void;
}

export type { CourierRequestCardProps };
