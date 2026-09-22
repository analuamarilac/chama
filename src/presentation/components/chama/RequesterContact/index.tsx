import { Phone, Store } from "lucide-react";

import { cn } from "#/lib/utils.ts";

import type { RequesterContactProps } from "./types.ts";

/** Remove a formatação para montar o link `tel:`. */
function toDialableNumber(phone: string) {
	return phone.replace(/[^+\d]/g, "");
}

/**
 * RN07 — telefone da LOJA solicitante.
 *
 * Existe como componente próprio, e não como um "campo de telefone" genérico,
 * justamente para que seja impossível exibir a linha interna do entregador
 * por engano. O par deste componente é `CourierInternalContact`.
 */
function RequesterContact({
	requesterPhone,
	variant = "card",
	className,
}: RequesterContactProps) {
	if (variant === "row") {
		return (
			<div className={cn("flex items-start gap-3", className)}>
				<Phone
					aria-hidden="true"
					className="mt-0.5 size-4 shrink-0 text-muted-foreground"
				/>
				<div className="min-w-0">
					<p className="text-muted-foreground text-xs">Telefone</p>
					<a
						href={`tel:${toDialableNumber(requesterPhone)}`}
						className="font-medium text-foreground text-sm underline-offset-4 hover:underline"
					>
						{requesterPhone}
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className={cn("flex items-start gap-3", className)}>
			<span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
				<Store aria-hidden="true" className="size-4" />
			</span>

			<div className="min-w-0">
				<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
					Telefone da loja
				</p>
				<a
					href={`tel:${toDialableNumber(requesterPhone)}`}
					className="font-heading font-semibold text-base text-foreground underline-offset-4 hover:underline"
				>
					{requesterPhone}
				</a>
			</div>
		</div>
	);
}

export { RequesterContact };
