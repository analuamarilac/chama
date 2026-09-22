import { tv } from "tailwind-variants";

const summaryTileStyles = tv({
	slots: {
		root: "flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4",
		iconWrapper:
			"flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground",
		value: "font-heading font-bold text-3xl text-foreground tabular-nums",
	},
	variants: {
		tone: {
			neutral: {},
			pending: {
				iconWrapper: "bg-status-pending-surface text-status-pending",
				value: "text-status-pending",
			},
			attended: {
				iconWrapper: "bg-status-attended-surface text-status-attended",
				value: "text-status-attended",
			},
		},
	},
	defaultVariants: {
		tone: "neutral",
	},
});

export { summaryTileStyles };
