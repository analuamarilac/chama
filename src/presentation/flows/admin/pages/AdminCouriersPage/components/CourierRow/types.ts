import type { Courier } from "#/domain/chama/types.ts";

interface CourierRowProps {
	courier: Courier;
	pendingCount: number;
	attendedCount: number;
	/** Entregador cuja caixa de entrada o perfil Entregador mostra. */
	isSessionCourier: boolean;
}

export type { CourierRowProps };
