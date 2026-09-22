import { CircleAlert } from "lucide-react";

import { FormMessage } from "#/components/ui/form.tsx";
import { cn } from "#/lib/utils.ts";

import type { FieldErrorProps } from "./types.ts";

/**
 * Mensagem de erro de campo, com ícone.
 *
 * O `FormMessage` do template já cuida do `aria-describedby` e do texto; o
 * ícone existe para que o erro não dependa apenas da cor vermelha — quem não
 * distingue vermelho continua vendo que algo está errado.
 *
 * Deve ser usado dentro de um `FormField`, que fornece o contexto do erro.
 */
function FieldError({ hasError, className }: FieldErrorProps) {
	return (
		<div className={cn("flex items-start gap-1.5", className)}>
			{hasError ? (
				<CircleAlert
					aria-hidden="true"
					className="mt-0.5 size-3.5 shrink-0 text-destructive"
				/>
			) : null}
			<FormMessage className="text-xs" />
		</div>
	);
}

export { FieldError };
