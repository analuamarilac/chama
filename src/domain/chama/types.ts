/**
 * Modelo de domínio do Chama.
 *
 * RN07: `requesterPhone` (telefone da loja) e `courierPhoneInternal` (linha interna
 * do entregador) são dados distintos e nunca devem ser tratados como o mesmo campo.
 */

const ContactRequestStatus = {
	Pending: "pending",
	Attended: "attended",
} as const;

type ContactRequestStatus =
	(typeof ContactRequestStatus)[keyof typeof ContactRequestStatus];

/**
 * P04: canal pelo qual o entregador é AVISADO. O MVP representa apenas push
 * no app; o campo existe para deixar o caminho multicanal (push → SMS) explícito.
 */
const NotificationChannel = {
	PushApp: "push_app",
} as const;

type NotificationChannel =
	(typeof NotificationChannel)[keyof typeof NotificationChannel];

/**
 * Superfície pela qual a LOJA abriu a solicitação.
 *
 * Não confundir com `NotificationChannel`: um descreve por onde o pedido entrou,
 * o outro por onde o entregador é avisado. São eixos diferentes da mesma jornada.
 */
const OriginChannel = {
	App: "app",
	Web: "web",
} as const;

type OriginChannelValue = (typeof OriginChannel)[keyof typeof OriginChannel];

/** RN02: o entregador vem do serviço mockado, não de uma lista intermediária. */
interface Courier {
	id: string;
	name: string;
	/** RN07: linha interna da WeFind. Visível apenas para o Admin. */
	phoneInternal: string;
}

/** Loja parceira que abre solicitações. */
interface Requester {
	id: string;
	storeName: string;
	operatorName: string;
}

interface ContactRequest {
	/** Identificador da solicitação, usado como protocolo visível ao solicitante. */
	id: string;
	/** RN01: referência textual livre, sem validação contra base. */
	orderCode: string;
	message: string;
	/** Loja que abriu a solicitação. Permite que cada loja veja só as suas. */
	requesterId: string;
	requesterStoreName: string;
	requesterOperatorName: string;
	/** RN07: telefone de quem abriu a solicitação (a loja). */
	requesterPhone: string;
	courierId: string;
	courierName: string;
	/** RN07: linha interna do entregador. Nunca exibida ao solicitante. */
	courierPhoneInternal: string;
	/** Por onde a loja abriu a solicitação. */
	originChannel: OriginChannelValue;
	/** Por onde o entregador foi avisado. */
	notificationChannel: NotificationChannel;
	status: ContactRequestStatus;
	createdAt: string;
	/** P01: momento em que o entregador abriu a solicitação. Não é um status. */
	viewedAt: string | null;
	/** P01: preenchido apenas quando o entregador declara o atendimento. */
	attendedAt: string | null;
}

interface CreateContactRequestInput {
	orderCode: string;
	requesterPhone: string;
	message: string;
}

export { ContactRequestStatus, NotificationChannel, OriginChannel };
export type {
	ContactRequest,
	CreateContactRequestInput,
	Courier,
	OriginChannelValue,
	Requester,
};
