import { ChamaPrototypeConfig } from "#/domain/chama/config.ts";
import {
	createSeedRequests,
	MockedCourier,
	MockedRequester,
} from "#/domain/chama/services/seed.ts";
import {
	type ContactRequest,
	ContactRequestStatus,
	type CreateContactRequestInput,
	NotificationChannel,
	OriginChannel,
} from "#/domain/chama/types.ts";

/**
 * Serviço mockado compartilhado pelas três experiências (RN03).
 *
 * O estado vive em memória durante a sessão (H05). Não há backend, banco nem
 * persistência entre recarregamentos — recarregar restaura o seed inicial.
 *
 * A latência simulada existe de propósito: sem ela não haveria estado de
 * carregamento real para as telas demonstrarem.
 */

const SIMULATED_LATENCY_MS = ChamaPrototypeConfig.simulatedLatencyMs;
const PROTOCOL_PREFIX = "CHM";
const PROTOCOL_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PROTOCOL_LENGTH = 5;

let contactRequests: ContactRequest[] = createSeedRequests();

function delay(milliseconds: number) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Protocolo curto e legível em voz alta: sem caracteres ambíguos (O/0, I/1),
 * porque a loja pode precisar ditá-lo ao suporte por telefone.
 */
function createProtocol() {
	const characters = Array.from({ length: PROTOCOL_LENGTH }, () => {
		const index = Math.floor(Math.random() * PROTOCOL_ALPHABET.length);
		return PROTOCOL_ALPHABET.charAt(index);
	});

	return `${PROTOCOL_PREFIX}-${characters.join("")}`;
}

function findRequestById(requestId: string) {
	return contactRequests.find((request) => request.id === requestId) ?? null;
}

function replaceRequest(updatedRequest: ContactRequest) {
	contactRequests = contactRequests.map((request) => {
		const isTargetRequest = request.id === updatedRequest.id;
		return isTargetRequest ? updatedRequest : request;
	});

	return updatedRequest;
}

async function listContactRequests(): Promise<ContactRequest[]> {
	await delay(SIMULATED_LATENCY_MS);

	return contactRequests.map((request) => ({ ...request }));
}

async function createContactRequest(
	input: CreateContactRequestInput,
): Promise<ContactRequest> {
	await delay(SIMULATED_LATENCY_MS);

	const createdRequest: ContactRequest = {
		id: createProtocol(),
		orderCode: input.orderCode.trim(),
		message: input.message.trim(),
		requesterId: MockedRequester.id,
		requesterStoreName: MockedRequester.storeName,
		requesterOperatorName: MockedRequester.operatorName,
		requesterPhone: input.requesterPhone.trim(),
		courierId: MockedCourier.id,
		courierName: MockedCourier.name,
		courierPhoneInternal: MockedCourier.phoneInternal,
		// Criada pela interface web do protótipo.
		originChannel: OriginChannel.Web,
		notificationChannel: NotificationChannel.PushApp,
		status: ContactRequestStatus.Pending,
		createdAt: new Date().toISOString(),
		viewedAt: null,
		attendedAt: null,
	};

	contactRequests = [createdRequest, ...contactRequests];

	return { ...createdRequest };
}

/**
 * P01: registra que o entregador abriu a solicitação. Não altera o status —
 * visualizar não é atender. Idempotente: a primeira abertura é a que conta.
 */
async function markContactRequestAsViewed(
	requestId: string,
): Promise<ContactRequest> {
	await delay(SIMULATED_LATENCY_MS);

	const request = findRequestById(requestId);

	if (!request) {
		throw new Error(`Solicitação ${requestId} não encontrada.`);
	}

	const wasAlreadyViewed = request.viewedAt !== null;

	if (wasAlreadyViewed) {
		return { ...request };
	}

	return replaceRequest({ ...request, viewedAt: new Date().toISOString() });
}

/**
 * P01: o entregador declara explicitamente que falou com a loja.
 * Idempotente: marcar duas vezes preserva o horário do primeiro atendimento.
 */
async function markContactRequestAsAttended(
	requestId: string,
): Promise<ContactRequest> {
	await delay(SIMULATED_LATENCY_MS);

	const request = findRequestById(requestId);

	if (!request) {
		throw new Error(`Solicitação ${requestId} não encontrada.`);
	}

	const wasAlreadyAttended = request.status === ContactRequestStatus.Attended;

	if (wasAlreadyAttended) {
		return { ...request };
	}

	const attendedAt = new Date().toISOString();

	return replaceRequest({
		...request,
		status: ContactRequestStatus.Attended,
		viewedAt: request.viewedAt ?? attendedAt,
		attendedAt,
	});
}

const chamaMockService = {
	listContactRequests,
	createContactRequest,
	markContactRequestAsViewed,
	markContactRequestAsAttended,
};

export { chamaMockService };
