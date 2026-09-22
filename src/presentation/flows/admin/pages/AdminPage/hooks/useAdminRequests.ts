import { useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";

import {
	type ContactRequest,
	ContactRequestStatus,
} from "#/domain/chama/types.ts";
import { Routes } from "#/presentation/constants/routes.ts";
import { useListContactRequests } from "#/presentation/hooks/services/chama/useListContactRequests/index.ts";

const StatusFilter = {
	All: "all",
	Pending: "pending",
	Attended: "attended",
} as const;

const SortOrder = {
	Newest: "newest",
	Oldest: "oldest",
} as const;

/**
 * P02: os filtros vivem na URL, não em estado local.
 *
 * Assim a operação consegue compartilhar "as pendentes desta semana" por link —
 * que é como um coordenador repassa um problema para o turno seguinte.
 * O schema é exportado para a rota usá-lo em `validateSearch`, mantendo uma
 * única fonte de verdade do contrato da URL.
 *
 * Datas são strings `YYYY-MM-DD`; vazio significa "sem limite".
 */
const adminSearchSchema = z.object({
	status: z
		.enum([StatusFilter.All, StatusFilter.Pending, StatusFilter.Attended])
		.default(StatusFilter.All),
	search: z.string().default(""),
	from: z.string().default(""),
	to: z.string().default(""),
	sort: z.enum([SortOrder.Newest, SortOrder.Oldest]).default(SortOrder.Newest),
});

type AdminSearch = z.infer<typeof adminSearchSchema>;
type StatusFilterValue = AdminSearch["status"];
type SortOrderValue = AdminSearch["sort"];

const StatusFilterPredicate = {
	[StatusFilter.All]: () => true,
	[StatusFilter.Pending]: (request: ContactRequest) =>
		request.status === ContactRequestStatus.Pending,
	[StatusFilter.Attended]: (request: ContactRequest) =>
		request.status === ContactRequestStatus.Attended,
} as const;

/** Converte `YYYY-MM-DD` no início do dia local. */
function startOfDay(isoDate: string) {
	if (isoDate.length === 0) {
		return null;
	}

	const [year, month, day] = isoDate.split("-").map(Number);

	return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
}

/** Converte `YYYY-MM-DD` no fim do dia local, para incluir o dia inteiro. */
function endOfDay(isoDate: string) {
	if (isoDate.length === 0) {
		return null;
	}

	const [year, month, day] = isoDate.split("-").map(Number);

	return new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
}

function sortRequests(requests: ContactRequest[], sort: SortOrderValue) {
	const direction = sort === SortOrder.Newest ? -1 : 1;

	return [...requests].sort(
		(first, second) =>
			direction *
			(new Date(first.createdAt).getTime() -
				new Date(second.createdAt).getTime()),
	);
}

function useAdminRequests() {
	const search = useSearch({
		// Id da rota-índice do painel — `/admin` é o layout com a barra lateral.
		from: "/admin/",
		select: (currentSearch) => adminSearchSchema.parse(currentSearch),
	});
	const navigate = useNavigate();
	const { contactRequests, isLoading, isRefreshing, isError, refetch } =
		useListContactRequests();

	function updateFilters(partial: Partial<AdminSearch>) {
		navigate({
			to: Routes.Admin,
			search: { ...search, ...partial },
			replace: true,
		});
	}

	// Estado derivado — recalculado no render a cada mudança de URL ou de dados.
	const normalizedSearchTerm = search.search.trim().toLowerCase();
	const matchesStatus = StatusFilterPredicate[search.status];
	const fromTimestamp = startOfDay(search.from);
	const toTimestamp = endOfDay(search.to);

	const filteredRequests = sortRequests(
		contactRequests.filter((request) => {
			const matchesSearchTerm =
				normalizedSearchTerm.length === 0 ||
				request.orderCode.toLowerCase().includes(normalizedSearchTerm) ||
				request.id.toLowerCase().includes(normalizedSearchTerm) ||
				request.requesterStoreName.toLowerCase().includes(normalizedSearchTerm);

			const createdAtTimestamp = new Date(request.createdAt).getTime();
			const matchesPeriod =
				(fromTimestamp === null || createdAtTimestamp >= fromTimestamp) &&
				(toTimestamp === null || createdAtTimestamp <= toTimestamp);

			return matchesStatus(request) && matchesSearchTerm && matchesPeriod;
		}),
		search.sort,
	);

	const pendingCount = contactRequests.filter(
		(request) => request.status === ContactRequestStatus.Pending,
	).length;
	const attendedCount = contactRequests.length - pendingCount;
	const unreadCount = contactRequests.filter(
		(request) =>
			request.status === ContactRequestStatus.Pending &&
			request.viewedAt === null,
	).length;

	const hasActiveFilters =
		search.status !== StatusFilter.All ||
		normalizedSearchTerm.length > 0 ||
		search.from.length > 0 ||
		search.to.length > 0;

	return {
		filteredRequests,
		totalCount: contactRequests.length,
		pendingCount,
		attendedCount,
		unreadCount,
		hasActiveFilters,
		statusFilter: search.status,
		searchTerm: search.search,
		periodFrom: search.from,
		periodTo: search.to,
		sortOrder: search.sort,
		isLoading,
		isRefreshing,
		isError,
		refetch,
		handleStatusChange: (status: StatusFilterValue) =>
			updateFilters({ status }),
		handleSearchChange: (searchTerm: string) =>
			updateFilters({ search: searchTerm }),
		handlePeriodChange: (from: string, to: string) =>
			updateFilters({ from, to }),
		handleSortToggle: () =>
			updateFilters({
				sort:
					search.sort === SortOrder.Newest
						? SortOrder.Oldest
						: SortOrder.Newest,
			}),
		handleClearFilters: () =>
			updateFilters({
				status: StatusFilter.All,
				search: "",
				from: "",
				to: "",
			}),
	};
}

export {
	adminSearchSchema,
	SortOrder,
	StatusFilter,
	useAdminRequests,
	type AdminSearch,
	type SortOrderValue,
	type StatusFilterValue,
};
