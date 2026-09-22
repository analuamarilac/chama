/**
 * Parâmetros do protótipo, expostos ao Admin em "Configurações".
 *
 * Ficam aqui, e não escondidos dentro do serviço, porque são justamente as
 * escolhas que um avaliador precisa conseguir conferir sem ler o código.
 */
const ChamaPrototypeConfig = {
	/** P04 — canal representado no MVP. */
	notificationChannelLabel: "Push no app do entregador",
	notificationChannelNote:
		"Representação simulada. Não há envio real de push, SMS ou WhatsApp.",
	/** Latência artificial do serviço mockado, em milissegundos. */
	simulatedLatencyMs: 350,
	persistenceLabel: "Memória da sessão",
	persistenceNote:
		"Os dados reiniciam ao recarregar a página. Não há banco nem persistência entre sessões.",
	/** P01 — quem declara o atendimento. */
	attendanceRuleLabel: "O entregador declara o atendimento",
	attendanceRuleNote:
		"Visualizar a solicitação não a conclui. Só a ação explícita do entregador marca como atendida.",
} as const;

export { ChamaPrototypeConfig };
