import type {
	SortOrderValue,
	StatusFilterValue,
} from "../../hooks/useAdminRequests.ts";

interface RequestsFiltersProps {
	statusFilter: StatusFilterValue;
	searchTerm: string;
	periodFrom: string;
	periodTo: string;
	sortOrder: SortOrderValue;
	onStatusChange: (status: StatusFilterValue) => void;
	onSearchChange: (searchTerm: string) => void;
	onPeriodChange: (from: string, to: string) => void;
	onSortToggle: () => void;
}

export type { RequestsFiltersProps };
