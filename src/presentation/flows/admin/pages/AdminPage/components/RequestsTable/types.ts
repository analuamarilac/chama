import type { ContactRequest } from "#/domain/chama/types.ts";

interface RequestsTableProps {
	requests: ContactRequest[];
	onOpenDetails: (request: ContactRequest) => void;
}

export type { RequestsTableProps };
