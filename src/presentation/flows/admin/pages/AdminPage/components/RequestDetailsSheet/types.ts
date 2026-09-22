import type { ContactRequest } from "#/domain/chama/types.ts";

interface RequestDetailsSheetProps {
	request: ContactRequest | null;
	onOpenChange: (isOpen: boolean) => void;
}

export type { RequestDetailsSheetProps };
