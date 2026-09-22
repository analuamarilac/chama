interface RequesterContactProps {
	/** RN07: telefone de quem abriu a solicitação. Nunca o telefone do entregador. */
	requesterPhone: string;
	/** `card` para blocos com folga; `row` para listas densas, como o app do entregador. */
	variant?: "card" | "row";
	className?: string;
}

export type { RequesterContactProps };
