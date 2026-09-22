import { CheckCircle2, Clock3 } from "lucide-react";

import { ContactRequestStatus } from "#/domain/chama/types.ts";

import { statusBadgeStyles } from "./styles.ts";
import type { StatusBadgeProps } from "./types.ts";

const StatusPresentation = {
	[ContactRequestStatus.Pending]: {
		label: "Pendente",
		icon: Clock3,
	},
	[ContactRequestStatus.Attended]: {
		label: "Atendida",
		icon: CheckCircle2,
	},
} as const;

function StatusBadge({ status, pendingLabel, className }: StatusBadgeProps) {
	const { label, icon: Icon } = StatusPresentation[status];
	const isPending = status === ContactRequestStatus.Pending;
	const visibleLabel = isPending ? (pendingLabel ?? label) : label;

	return (
		<span className={statusBadgeStyles({ status, className })}>
			<Icon aria-hidden="true" className="size-3.5" />
			{visibleLabel}
		</span>
	);
}

export { StatusBadge };
