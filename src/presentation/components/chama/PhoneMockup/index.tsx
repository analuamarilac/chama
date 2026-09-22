import { BatteryFull, Signal, Wifi } from "lucide-react";

import type { PhoneMockupProps } from "./types.ts";

const MOCK_STATUS_TIME = "9:41";

/**
 * Moldura de celular para apresentar a experiência do entregador no desktop.
 *
 * A moldura só existe a partir de `lg`. Em telas pequenas seria absurdo
 * desenhar um celular dentro de um celular: ali o conteúdo ocupa a tela
 * inteira, que é o meio real do entregador.
 *
 * O conteúdo é renderizado **uma única vez** e a moldura aparece por CSS —
 * duplicar a árvore por breakpoint duplicaria ids, estado e foco.
 *
 * A casca é decorativa: `aria-hidden` na barra de status evita que o leitor de
 * tela anuncie bateria e sinal falsos.
 */
function PhoneMockup({ children, label }: PhoneMockupProps) {
	return (
		<figure aria-label={label} className="m-0 w-full lg:flex lg:justify-center">
			<div className="w-full lg:h-[760px] lg:w-[390px] lg:shrink-0 lg:rounded-[2.75rem] lg:bg-brand-navy lg:p-3 lg:shadow-[0_24px_60px_-20px_rgba(23,35,60,0.45)]">
				<div className="relative flex h-full w-full flex-col overflow-hidden bg-background lg:rounded-[2.1rem]">
					<div
						aria-hidden="true"
						className="hidden shrink-0 items-center justify-between px-6 pt-3 pb-1 font-medium text-foreground text-xs lg:flex"
					>
						<span className="tabular-nums">{MOCK_STATUS_TIME}</span>
						<span className="flex items-center gap-1">
							<Signal className="size-3.5" />
							<Wifi className="size-3.5" />
							<BatteryFull className="size-4" />
						</span>
					</div>

					<div
						aria-hidden="true"
						className="-translate-x-1/2 absolute top-2 left-1/2 hidden h-6 w-28 rounded-full bg-brand-navy lg:block"
					/>

					<div className="min-h-0 flex-1 lg:overflow-y-auto">{children}</div>
				</div>
			</div>
		</figure>
	);
}

export { PhoneMockup };
