import type { VariantProps } from "tailwind-variants";

import type { logoStyles } from "./styles.ts";

/** `full` é o wordmark completo; `symbol` é apenas o sinal, para espaços reduzidos. */
type LogoVariant = "full" | "symbol";

/** `dark` para fundos claros, `light` para fundos navy. */
type LogoTone = "dark" | "light";

interface LogoProps extends VariantProps<typeof logoStyles> {
	variant?: LogoVariant;
	tone?: LogoTone;
	className?: string;
}

export type { LogoProps, LogoTone, LogoVariant };
