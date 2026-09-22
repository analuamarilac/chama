import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search } from "lucide-react";

import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import { PeriodRangePicker } from "#/presentation/components/chama/PeriodRangePicker/index.tsx";

import {
	SortOrder,
	StatusFilter,
	type StatusFilterValue,
} from "../../hooks/useAdminRequests.ts";
import type { RequestsFiltersProps } from "./types.ts";

const StatusOptions = [
	{ value: StatusFilter.All, label: "Todos os status" },
	{ value: StatusFilter.Pending, label: "Pendentes" },
	{ value: StatusFilter.Attended, label: "Atendidas" },
] as const;

function RequestsFilters({
	statusFilter,
	searchTerm,
	periodFrom,
	periodTo,
	sortOrder,
	onStatusChange,
	onSearchChange,
	onPeriodChange,
	onSortToggle,
}: RequestsFiltersProps) {
	const isNewestFirst = sortOrder === SortOrder.Newest;
	const SortIcon = isNewestFirst ? ArrowDownWideNarrow : ArrowUpWideNarrow;

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 lg:flex-row lg:items-center">
			{/* RN06: filtro por status — requisito mínimo do Admin. */}
			<Select
				value={statusFilter}
				onValueChange={(value) => onStatusChange(value as StatusFilterValue)}
			>
				<SelectTrigger
					className="h-10 w-full lg:w-48"
					aria-label="Filtrar por status"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{StatusOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<PeriodRangePicker
				from={periodFrom}
				to={periodTo}
				onChange={onPeriodChange}
			/>

			<div className="relative flex-1">
				<Search
					aria-hidden="true"
					className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground"
				/>
				<Input
					type="search"
					value={searchTerm}
					onChange={(event) => onSearchChange(event.target.value)}
					placeholder="Buscar por código ou solicitante..."
					aria-label="Buscar por código do pedido, protocolo ou loja solicitante"
					className="h-10 pl-9"
				/>
			</div>

			<Button
				type="button"
				variant="outline"
				onClick={onSortToggle}
				className="h-10 shrink-0 gap-2"
			>
				<SortIcon aria-hidden="true" className="size-4" />
				<span className="hidden sm:inline">
					{isNewestFirst ? "Mais recentes" : "Mais antigas"}
				</span>
			</Button>
		</div>
	);
}

export { RequestsFilters };
