import {
	MockedCourier,
	MockedRequester,
} from "#/domain/chama/services/seed.ts";

/**
 * Identidades simuladas do protótipo.
 *
 * RN08: não há autenticação. Estes nomes existem só para dar contexto às telas —
 * o menu de sessão avisa explicitamente que não existe login.
 */
const PrototypeSession = {
	Solicitante: {
		name: MockedRequester.operatorName,
		role: `Loja parceira · ${MockedRequester.storeName}`,
	},
	Entregador: {
		name: MockedCourier.name,
		role: "Entregador",
	},
	Admin: {
		name: "Admin",
		role: "Operação WeFind",
	},
} as const;

export { PrototypeSession };
