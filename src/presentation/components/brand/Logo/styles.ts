import { tv } from "tailwind-variants";

const logoStyles = tv({
	base: "block w-auto select-none",
	variants: {
		size: {
			sm: "h-6",
			md: "h-8",
			lg: "h-10",
			xl: "h-12",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export { logoStyles };
