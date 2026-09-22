import { tv } from "tailwind-variants";

const profileCardStyles = tv({
	slots: {
		root: "flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-8 text-center transition-colors",
		icon: "text-brand-navy dark:text-brand-cream",
		title: "font-heading font-semibold text-card-foreground text-lg",
		description: "text-muted-foreground text-sm leading-relaxed",
		action: "mt-3 h-11 w-full gap-2",
	},
	variants: {
		isPrimary: {
			true: {
				root: "border-brand-coral/40",
			},
			false: {
				root: "hover:border-brand-coral/40",
			},
		},
	},
	defaultVariants: {
		isPrimary: false,
	},
});

export { profileCardStyles };
