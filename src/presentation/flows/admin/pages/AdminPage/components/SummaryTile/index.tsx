import { summaryTileStyles } from "./styles.ts";
import type { SummaryTileProps } from "./types.ts";

function SummaryTile({
	icon: Icon,
	label,
	value,
	hint,
	tone,
}: SummaryTileProps) {
	const styles = summaryTileStyles({ tone });

	return (
		<div className={styles.root()}>
			<div className="flex min-w-0 flex-col gap-0.5">
				<p className="font-medium text-muted-foreground text-sm">{label}</p>
				<p className={styles.value()}>{value}</p>
				{hint ? (
					<p className="text-muted-foreground text-xs leading-relaxed">
						{hint}
					</p>
				) : null}
			</div>

			<span className={styles.iconWrapper()}>
				<Icon aria-hidden="true" className="size-4" />
			</span>
		</div>
	);
}

export { SummaryTile };
