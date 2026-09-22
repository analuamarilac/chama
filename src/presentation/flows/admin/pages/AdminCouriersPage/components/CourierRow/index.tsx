import { TableCell, TableRow } from "#/components/ui/table.tsx";
import { CourierInternalContact } from "#/presentation/components/chama/CourierInternalContact/index.tsx";

import type { CourierRowProps } from "./types.ts";

function CourierRow({
	courier,
	pendingCount,
	attendedCount,
	isSessionCourier,
}: CourierRowProps) {
	return (
		<TableRow>
			<TableCell className="whitespace-nowrap">
				<span className="font-medium text-foreground">{courier.name}</span>
				{isSessionCourier ? (
					<span className="ml-2 rounded-full bg-brand-coral/15 px-2 py-0.5 font-medium text-brand-coral-text text-xs">
						Sessão do protótipo
					</span>
				) : null}
				<span className="block text-muted-foreground text-xs">
					{courier.id}
				</span>
			</TableCell>

			{/* RN07: a linha interna usa o mesmo componente restrito do resto do painel. */}
			<TableCell>
				<CourierInternalContact
					courierName={courier.name}
					courierPhoneInternal={courier.phoneInternal}
					className="w-fit"
				/>
			</TableCell>

			<TableCell className="whitespace-nowrap">
				<span className="font-heading font-semibold text-lg text-status-pending tabular-nums">
					{pendingCount}
				</span>
			</TableCell>

			<TableCell className="whitespace-nowrap">
				<span className="font-heading font-semibold text-lg text-status-attended tabular-nums">
					{attendedCount}
				</span>
			</TableCell>
		</TableRow>
	);
}

export { CourierRow };
