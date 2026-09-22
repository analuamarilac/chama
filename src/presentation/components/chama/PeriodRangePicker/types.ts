interface PeriodRangePickerProps {
	/** `YYYY-MM-DD` ou vazio. */
	from: string;
	to: string;
	onChange: (from: string, to: string) => void;
}

export type { PeriodRangePickerProps };
