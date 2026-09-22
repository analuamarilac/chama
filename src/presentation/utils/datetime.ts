import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const EMPTY_VALUE = "—";

/** Data e hora completas, para o Admin auditar. */
function formatDateTime(isoDate: string | null) {
	if (!isoDate) {
		return EMPTY_VALUE;
	}

	return new Date(isoDate).toLocaleString("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	});
}

/**
 * Formato compacto (21/09 18:34) para tabelas densas.
 *
 * O ano é omitido porque todos os registros pertencem à sessão atual —
 * exibi-lo custaria largura de coluna sem informar nada.
 */
function formatShortDateTime(isoDate: string | null) {
	if (!isoDate) {
		return EMPTY_VALUE;
	}

	return new Date(isoDate).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/** Apenas a hora, suficiente quando a data já está no contexto. */
function formatTime(isoDate: string | null) {
	if (!isoDate) {
		return EMPTY_VALUE;
	}

	return new Date(isoDate).toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * Tempo relativo ("há 8 minutos"), que é como o entregador e a operação
 * realmente pensam sobre uma solicitação em aberto.
 */
function formatRelativeTime(isoDate: string | null) {
	if (!isoDate) {
		return EMPTY_VALUE;
	}

	return formatDistanceToNow(new Date(isoDate), {
		addSuffix: true,
		locale: ptBR,
	});
}

export { formatDateTime, formatRelativeTime, formatShortDateTime, formatTime };
