import {
	type ContactRequest,
	ContactRequestStatus,
	type Courier,
	NotificationChannel,
	OriginChannel,
	type OriginChannelValue,
	type Requester,
} from "#/domain/chama/types.ts";

/**
 * RN02 / H02: sem base real de entregadores, o conjunto abaixo é fixo.
 *
 * O primeiro é o entregador da sessão — é a caixa de entrada que o perfil
 * Entregador mostra. Os demais existem para que o Admin tenha uma operação
 * plausível para coordenar, com mais de um nome em jogo.
 */
const MockedCouriers: readonly Courier[] = [
	{
		id: "wf-courier-4471",
		name: "Diego Matias",
		phoneInternal: "+55 11 4000-2210",
	},
	{
		id: "wf-courier-2318",
		name: "Pedro Alves",
		phoneInternal: "+55 11 4000-2244",
	},
	{
		id: "wf-courier-5590",
		name: "Letícia Rocha",
		phoneInternal: "+55 11 4000-2261",
	},
	{
		id: "wf-courier-1127",
		name: "Rafael Santos",
		phoneInternal: "+55 11 4000-2287",
	},
	{
		id: "wf-courier-8042",
		name: "Aline Souza",
		phoneInternal: "+55 11 4000-2299",
	},
];

/** Entregador da sessão do protótipo. */
const MockedCourier = MockedCouriers[0];

/**
 * H03 / H08: a loja da sessão é fixa. Em produção viria do cadastro.
 *
 * Nenhuma solicitação do seed pertence a ela — é isso que faz a listagem do
 * Solicitante começar vazia e o estado vazio existir de verdade.
 */
const MockedRequester: Requester = {
	id: "wf-store-2201",
	storeName: "Mercearia Vila Nova",
	operatorName: "Marina Souza",
};

const SeedRequesters: readonly Requester[] = [
	{
		id: "wf-store-1180",
		storeName: "Padaria Aurora",
		operatorName: "Carlos Mendes",
	},
	{
		id: "wf-store-3042",
		storeName: "Farmácia Bom Dia",
		operatorName: "Juliana Lima",
	},
	{
		id: "wf-store-4415",
		storeName: "Hortifruti Sol Nascente",
		operatorName: "Roberto Costa",
	},
	{
		id: "wf-store-5127",
		storeName: "Pet Shop Lua",
		operatorName: "Fernanda Alves",
	},
];

const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;

interface SeedSpec {
	id: string;
	orderCode: string;
	message: string;
	requesterIndex: number;
	requesterPhone: string;
	courierIndex: number;
	originChannel: OriginChannelValue;
	createdHoursAgo: number;
	/** Minutos após a criação em que o entregador abriu. `null` = não abriu. */
	viewedAfterMinutes: number | null;
	/** Minutos após a criação em que declarou o atendimento. `null` = pendente. */
	attendedAfterMinutes: number | null;
}

const SeedSpecs: readonly SeedSpec[] = [
	{
		id: "CHM-7F2K9",
		orderCode: "WF-48107",
		message:
			"O cliente ligou avisando que o portão da frente está fechado. Pode entrar pela lateral do prédio.",
		requesterIndex: 0,
		requesterPhone: "(11) 97722-4410",
		courierIndex: 1,
		originChannel: OriginChannel.Web,
		createdHoursAgo: 0.2,
		viewedAfterMinutes: null,
		attendedAfterMinutes: null,
	},
	{
		id: "CHM-9L4TP",
		orderCode: "WF-48096",
		message:
			"O pedido saiu sem o molho. Consegue voltar aqui antes de seguir para a próxima entrega?",
		requesterIndex: 1,
		requesterPhone: "(11) 98765-4433",
		courierIndex: 2,
		originChannel: OriginChannel.App,
		createdHoursAgo: 0.6,
		viewedAfterMinutes: 4,
		attendedAfterMinutes: null,
	},
	{
		id: "CHM-2M8RD",
		orderCode: "WF-48071",
		message:
			"A cliente pediu para deixar na portaria e avisar o porteiro do bloco B.",
		requesterIndex: 2,
		requesterPhone: "(11) 99612-8899",
		courierIndex: 3,
		originChannel: OriginChannel.Web,
		createdHoursAgo: 2.5,
		viewedAfterMinutes: null,
		attendedAfterMinutes: null,
	},
	{
		id: "CHM-5T1WQ",
		orderCode: "WF-48044",
		message: "Precisamos confirmar se o pedido já saiu para entrega.",
		requesterIndex: 3,
		requesterPhone: "(11) 93321-7744",
		courierIndex: 4,
		originChannel: OriginChannel.App,
		createdHoursAgo: 5,
		viewedAfterMinutes: 11,
		attendedAfterMinutes: null,
	},
	{
		id: "CHM-3B8Q1",
		orderCode: "WF-47862",
		message:
			"Faltou um item na sacola do pedido. Precisamos combinar se você volta para buscar.",
		requesterIndex: 1,
		requesterPhone: "(11) 98130-5507",
		courierIndex: 1,
		originChannel: OriginChannel.Web,
		createdHoursAgo: 26,
		viewedAfterMinutes: 3,
		attendedAfterMinutes: 11,
	},
	{
		id: "CHM-6H2VX",
		orderCode: "WF-47790",
		message:
			"O endereço do pedido está com o número trocado. É o 482, não o 428.",
		requesterIndex: 2,
		requesterPhone: "(11) 99445-2211",
		courierIndex: 1,
		originChannel: OriginChannel.App,
		createdHoursAgo: 49,
		viewedAfterMinutes: 2,
		attendedAfterMinutes: 8,
	},
	{
		id: "CHM-8K5NZ",
		orderCode: "WF-47712",
		message:
			"Cliente quer adiantar a entrega, se der. Consegue passar aqui antes?",
		requesterIndex: 0,
		requesterPhone: "(11) 97722-4410",
		courierIndex: 2,
		originChannel: OriginChannel.Web,
		createdHoursAgo: 73,
		viewedAfterMinutes: 6,
		attendedAfterMinutes: 19,
	},
	{
		id: "CHM-4C7YB",
		orderCode: "WF-47655",
		message:
			"A embalagem chegou molhada. Precisamos alinhar a troca com o cliente.",
		requesterIndex: 3,
		requesterPhone: "(11) 93321-7744",
		courierIndex: 3,
		originChannel: OriginChannel.App,
		createdHoursAgo: 98,
		viewedAfterMinutes: 5,
		attendedAfterMinutes: 22,
	},
	{
		id: "CHM-1P9JF",
		orderCode: "WF-47588",
		message: "O cliente não atende. Podemos deixar com o vizinho do 301?",
		requesterIndex: 1,
		requesterPhone: "(11) 98765-4433",
		courierIndex: 4,
		originChannel: OriginChannel.Web,
		createdHoursAgo: 122,
		viewedAfterMinutes: 9,
		attendedAfterMinutes: 15,
	},
	{
		id: "CHM-7R3GK",
		orderCode: "WF-47501",
		message: "Confirmação de horário: o cliente só recebe depois das 18h.",
		requesterIndex: 2,
		requesterPhone: "(11) 99612-8899",
		courierIndex: 1,
		originChannel: OriginChannel.App,
		createdHoursAgo: 170,
		viewedAfterMinutes: 3,
		attendedAfterMinutes: 7,
	},
	{
		id: "CHM-2Z6DL",
		orderCode: "WF-47430",
		message: "Precisamos cancelar um item do pedido antes da entrega.",
		requesterIndex: 0,
		requesterPhone: "(11) 97722-4410",
		courierIndex: 2,
		originChannel: OriginChannel.Web,
		createdHoursAgo: 216,
		viewedAfterMinutes: 12,
		attendedAfterMinutes: 30,
	},
	{
		id: "CHM-5W8QT",
		orderCode: "WF-47365",
		message: "O cliente trocou o endereço de entrega no último minuto.",
		requesterIndex: 3,
		requesterPhone: "(11) 93321-7744",
		courierIndex: 3,
		originChannel: OriginChannel.App,
		createdHoursAgo: 264,
		viewedAfterMinutes: 4,
		attendedAfterMinutes: 13,
	},
];

function buildSeedRequest(spec: SeedSpec): ContactRequest {
	const requester = SeedRequesters[spec.requesterIndex];
	const courier = MockedCouriers[spec.courierIndex];
	const createdAtMs = Date.now() - spec.createdHoursAgo * HOUR_IN_MS;
	const isAttended = spec.attendedAfterMinutes !== null;

	function offsetFromCreation(minutes: number | null) {
		if (minutes === null) {
			return null;
		}

		return new Date(createdAtMs + minutes * MINUTE_IN_MS).toISOString();
	}

	return {
		id: spec.id,
		orderCode: spec.orderCode,
		message: spec.message,
		requesterId: requester.id,
		requesterStoreName: requester.storeName,
		requesterOperatorName: requester.operatorName,
		requesterPhone: spec.requesterPhone,
		courierId: courier.id,
		courierName: courier.name,
		courierPhoneInternal: courier.phoneInternal,
		originChannel: spec.originChannel,
		notificationChannel: NotificationChannel.PushApp,
		status: isAttended
			? ContactRequestStatus.Attended
			: ContactRequestStatus.Pending,
		createdAt: new Date(createdAtMs).toISOString(),
		viewedAt: offsetFromCreation(spec.viewedAfterMinutes),
		attendedAt: offsetFromCreation(spec.attendedAfterMinutes),
	};
}

function createSeedRequests(): ContactRequest[] {
	return SeedSpecs.map(buildSeedRequest);
}

export { createSeedRequests, MockedCourier, MockedCouriers, MockedRequester };
