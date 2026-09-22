import { tv } from "tailwind-variants";

const requestStatusPanelStyles = tv({
	slots: {
		root: "flex h-full flex-col items-center justify-center gap-4 rounded-2xl border p-6 text-center",
		media: "flex size-14 items-center justify-center rounded-full",
		title: "font-heading font-semibold text-xl",
	},
	variants: {
		state: {
			idle: {
				root: "border-border border-dashed bg-card",
				media: "bg-secondary text-brand-navy dark:text-brand-cream",
				title: "text-card-foreground",
			},
			sending: {
				root: "border-border bg-card",
				media: "bg-secondary text-brand-navy dark:text-brand-cream",
				title: "text-card-foreground",
			},
			sent: {
				root: "border-status-attended/30 bg-status-attended-surface",
				media: "bg-status-attended text-white",
				title: "text-foreground",
			},
		},
	},
	defaultVariants: {
		state: "idle",
	},
});

export { requestStatusPanelStyles };
