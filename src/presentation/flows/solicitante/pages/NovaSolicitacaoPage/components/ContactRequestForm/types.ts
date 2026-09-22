import type { ContactRequestSchema } from "../../schema.ts";

interface ContactRequestFormProps {
	isPending: boolean;
	/**
	 * Depois do envio o formulário vira recibo: mantém o que foi enviado e
	 * trava, para não gerar uma segunda solicitação por engano. A página
	 * remonta o componente via `key` quando a pessoa pede outra solicitação.
	 */
	isSent: boolean;
	/** Rejeita para manter o preenchimento quando o envio falha. */
	onSubmit: (values: ContactRequestSchema) => Promise<void>;
}

export type { ContactRequestFormProps };
