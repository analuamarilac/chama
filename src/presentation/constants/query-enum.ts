/**
 * Chaves de cache do React Query.
 *
 * As três visões (Solicitante, Entregador e Admin) compartilham a mesma chave.
 * É isso que faz uma mutation em um perfil atualizar a tela dos outros.
 */
const QueryKeys = {
	ContactRequests: "contact-requests",
} as const;

export { QueryKeys };
