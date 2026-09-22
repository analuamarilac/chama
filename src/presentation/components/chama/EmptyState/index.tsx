import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "#/components/ui/empty.tsx";
import { cn } from "#/lib/utils.ts";

import type { EmptyStateProps } from "./types.ts";

function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<Empty
			className={cn(
				"rounded-xl border border-border border-dashed bg-card/50",
				className,
			)}
		>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Icon aria-hidden="true" className="size-6" />
				</EmptyMedia>
				<EmptyTitle className="font-heading">{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>

			{action ? <EmptyContent>{action}</EmptyContent> : null}
		</Empty>
	);
}

export { EmptyState };
