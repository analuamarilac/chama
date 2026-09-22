import type { ContactRequest } from "#/domain/chama/types.ts";

/** `idle` antes do envio, `sending` durante e `sent` depois de confirmado. */
type RequestStatusPanelState = "idle" | "sending" | "sent";

interface RequestStatusPanelProps {
	state: RequestStatusPanelState;
	/** Presente apenas em `sent`. */
	request?: ContactRequest | null;
	onCreateAnother: () => void;
}

export type { RequestStatusPanelProps, RequestStatusPanelState };
