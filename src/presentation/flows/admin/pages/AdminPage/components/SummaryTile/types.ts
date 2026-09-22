import type { LucideIcon } from "lucide-react";

interface SummaryTileProps {
	icon: LucideIcon;
	label: string;
	value: number;
	hint?: string;
	tone?: "neutral" | "pending" | "attended";
}

export type { SummaryTileProps };
