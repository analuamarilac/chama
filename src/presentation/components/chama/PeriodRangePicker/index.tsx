import { ptBR } from "date-fns/locale";
import { CalendarDays, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "#/components/ui/button.tsx";
import { Calendar } from "#/components/ui/calendar.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover.tsx";

import type { PeriodRangePickerProps } from "./types.ts";

/** `YYYY-MM-DD` → Date local, evitando o deslocamento de fuso do `new Date(iso)`. */
function parseIsoDate(isoDate: string) {
	if (isoDate.length === 0) {
		return undefined;
	}

	const [year, month, day] = isoDate.split("-").map(Number);

	return new Date(year, month - 1, day);
}

function toIsoDate(date: Date | undefined) {
	if (!date) {
		return "";
	}

	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");

	return `${date.getFullYear()}-${month}-${day}`;
}

function formatLabel(date: Date | undefined) {
	if (!date) {
		return "";
	}

	return date.toLocaleDateString("pt-BR");
}

/**
 * Filtro de período do painel.
 *
 * O valor vive na URL como duas datas simples, e não como objeto: é o que
 * mantém o link do filtro compartilhável e legível.
 */
function PeriodRangePicker({ from, to, onChange }: PeriodRangePickerProps) {
	const selectedRange: DateRange | undefined = parseIsoDate(from)
		? { from: parseIsoDate(from), to: parseIsoDate(to) }
		: undefined;

	const hasPeriod = from.length > 0 || to.length > 0;
	const label = hasPeriod
		? `${formatLabel(parseIsoDate(from))}${to.length > 0 ? ` – ${formatLabel(parseIsoDate(to))}` : ""}`
		: "Todo o período";

	function handleSelect(range: DateRange | undefined) {
		onChange(toIsoDate(range?.from), toIsoDate(range?.to));
	}

	return (
		<div className="flex items-center gap-1">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="h-10 justify-start gap-2 font-normal"
					>
						<CalendarDays
							aria-hidden="true"
							className="size-4 text-muted-foreground"
						/>
						{label}
						<span className="sr-only">Filtrar por período de criação</span>
					</Button>
				</PopoverTrigger>

				<PopoverContent align="start" className="w-auto p-0">
					<Calendar
						mode="range"
						locale={ptBR}
						numberOfMonths={1}
						selected={selectedRange}
						onSelect={handleSelect}
						autoFocus
					/>
				</PopoverContent>
			</Popover>

			{hasPeriod ? (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => onChange("", "")}
					aria-label="Limpar período"
				>
					<X aria-hidden="true" className="size-4" />
				</Button>
			) : null}
		</div>
	);
}

export { PeriodRangePicker };
