import type { DecisionCardProps } from "./types.ts";

function DecisionCard({
	code,
	question,
	decision,
	rationale,
}: DecisionCardProps) {
	return (
		<article className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
			<div className="flex items-center gap-2">
				<span className="rounded-md bg-brand-navy px-1.5 py-0.5 font-heading font-semibold text-[0.7rem] text-brand-cream">
					{code}
				</span>
				<h3 className="font-medium text-muted-foreground text-sm">
					{question}
				</h3>
			</div>

			<p className="font-heading font-semibold text-card-foreground">
				{decision}
			</p>
			<p className="text-muted-foreground text-sm leading-relaxed">
				{rationale}
			</p>
		</article>
	);
}

export { DecisionCard };
