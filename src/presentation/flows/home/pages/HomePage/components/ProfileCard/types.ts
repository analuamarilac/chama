import type { LucideIcon } from "lucide-react";

interface ProfileCardProps {
	to: string;
	icon: LucideIcon;
	title: string;
	description: string;
	/** O primeiro cartão recebe o botão de marca; os demais ficam em contorno. */
	isPrimary?: boolean;
}

export type { ProfileCardProps };
