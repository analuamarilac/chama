import { BellRing } from "lucide-react";

import { formatRelativeTime } from "#/presentation/utils/datetime.ts";

import type { NewRequestBannerProps } from "./types.ts";

/**
 * P04 / H07: a notificação push representada como estado, não como toast.
 *
 * Um toast some em segundos e só apareceria para quem estivesse com a tela
 * aberta no instante exato. O entregador chega depois — precisa encontrar o
 * aviso ainda ali. A faixa some quando não há mais solicitações não lidas.
 */
function NewRequestBanner({
	unreadCount,
	latestCreatedAt,
}: NewRequestBannerProps) {
	const title =
		unreadCount === 1
			? "Nova solicitação recebida"
			: `${unreadCount} novas solicitações recebidas`;

	return (
		<div
			aria-live="polite"
			className="flex items-center gap-3 rounded-xl border border-brand-coral/40 bg-brand-coral/10 px-3 py-2.5"
		>
			<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-coral text-brand-navy">
				<BellRing aria-hidden="true" className="size-4" />
			</span>

			<p className="min-w-0 flex-1 font-medium text-foreground text-sm">
				{title}
			</p>

			<span className="shrink-0 text-muted-foreground text-xs">
				{formatRelativeTime(latestCreatedAt)}
			</span>
		</div>
	);
}

export { NewRequestBanner };
