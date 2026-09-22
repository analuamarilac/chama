import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import type { profileShellStyles } from "./styles.ts";

interface ProfileShellProps extends VariantProps<typeof profileShellStyles> {
	/** Raiz do caminho, exibida no breadcrumb. Ex.: "Solicitante". */
	profileLabel: string;
	/** Rota da raiz do perfil. Só vira link quando há uma página filha. */
	profileHref?: string;
	/** Página atual dentro do perfil. Ex.: "Solicitar contato". */
	pageLabel?: string;
	userName: string;
	userRole: string;
	/** Slot à esquerda do menu de sessão — usado pelo Entregador para o contador. */
	headerAction?: ReactNode;
	children: ReactNode;
}

export type { ProfileShellProps };
