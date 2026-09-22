import { ShieldCheck } from "lucide-react";

import { cn } from "#/lib/utils.ts";

import type { CourierInternalContactProps } from "./types.ts";

/**
 * RN07 — linha INTERNA do entregador.
 *
 * Renderizado apenas na visão do Admin. O rótulo, o ícone e o aviso de restrição
 * são diferentes dos de `RequesterContact` de propósito: os dois telefones
 * aparecem lado a lado no Admin e não podem ser confundidos.
 *
 * Não é um link `tel:`. O dado existe para a operação consultar, não para
 * incentivar discagem direta — que é justamente o hábito que o Chama substitui.
 */
function CourierInternalContact({
	courierName,
	courierPhoneInternal,
	className,
}: CourierInternalContactProps) {
	return (
		<div
			className={cn(
				"flex items-start gap-3 rounded-lg border border-border border-dashed bg-muted/40 p-3",
				className,
			)}
		>
			<span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-cream">
				<ShieldCheck aria-hidden="true" className="size-4" />
			</span>

			<div className="min-w-0">
				<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
					Linha interna do entregador
				</p>
				<p className="font-heading font-semibold text-base text-foreground">
					{courierPhoneInternal}
				</p>
				<p className="mt-0.5 text-muted-foreground text-xs">
					{courierName} · visível apenas para a operação
				</p>
			</div>
		</div>
	);
}

export { CourierInternalContact };
