import { z } from "zod";

import { hasValidPhoneLength } from "#/presentation/utils/phone.ts";

const ORDER_CODE_MIN_LENGTH = 3;
const ORDER_CODE_MAX_LENGTH = 24;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 500;

/**
 * RN01: o código do pedido não é validado contra nenhuma base — as regras abaixo
 * apenas garantem que o campo foi preenchido com algo utilizável como referência.
 *
 * As mensagens de erro dizem o que fazer, não o que deu errado: "Informe o
 * código do pedido" em vez de "campo obrigatório".
 */
const contactRequestSchema = z.object({
	orderCode: z
		.string()
		.trim()
		.min(ORDER_CODE_MIN_LENGTH, "Informe o código do pedido.")
		.max(ORDER_CODE_MAX_LENGTH, "O código do pedido é muito longo."),
	requesterPhone: z
		.string()
		.trim()
		.min(1, "Informe um telefone para o entregador retornar.")
		.refine(hasValidPhoneLength, "Informe um telefone válido com DDD."),
	message: z
		.string()
		.trim()
		.min(MESSAGE_MIN_LENGTH, "Explique o motivo do contato em uma frase.")
		.max(MESSAGE_MAX_LENGTH, "A mensagem é muito longa."),
});

type ContactRequestSchema = z.infer<typeof contactRequestSchema>;

export {
	contactRequestSchema,
	MESSAGE_MAX_LENGTH,
	ORDER_CODE_MAX_LENGTH,
	type ContactRequestSchema,
};
