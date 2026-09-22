import type { AboutSectionProps } from "./types.ts";

function AboutSection({ id, eyebrow, title, children }: AboutSectionProps) {
	return (
		<section aria-labelledby={id} className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<p className="font-medium text-brand-coral-text text-xs uppercase tracking-[0.12em]">
					{eyebrow}
				</p>
				<h2
					id={id}
					className="font-heading font-bold text-2xl text-foreground tracking-tight"
				>
					{title}
				</h2>
			</div>

			{children}
		</section>
	);
}

export { AboutSection };
