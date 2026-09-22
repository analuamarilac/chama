import { tv } from "tailwind-variants";

/**
 * Status nunca depende só de cor: cada variante combina cor, ícone e rótulo,
 * para continuar legível em daltonismo ou impressão em preto e branco.
 */
const statusBadgeStyles = tv({
	base: "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-xs",
	variants: {
		status: {
			pending: "bg-status-pending-surface text-status-pending",
			attended: "bg-status-attended-surface text-status-attended",
		},
	},
	defaultVariants: {
		status: "pending",
	},
});

export { statusBadgeStyles };
