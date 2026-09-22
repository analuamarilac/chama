import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
	/** Ação opcional — um estado vazio com saída é melhor que um beco sem saída. */
	action?: ReactNode;
	className?: string;
}

export type { EmptyStateProps };
