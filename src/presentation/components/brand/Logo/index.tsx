import logoDark from "#/assets/brand/logo.png";
import logoLight from "#/assets/brand/logo-claro.png";
import symbolDark from "#/assets/brand/simbolo.png";
import symbolLight from "#/assets/brand/simbolo-claro.png";

import { logoStyles } from "./styles.ts";
import type { LogoProps } from "./types.ts";

const LogoSources = {
	full: {
		dark: logoDark,
		light: logoLight,
	},
	symbol: {
		dark: symbolDark,
		light: symbolLight,
	},
} as const;

const LogoAlternativeText = {
	full: "Chama, um produto WeFind",
	symbol: "Chama",
} as const;

function Logo({ variant = "full", tone = "dark", size, className }: LogoProps) {
	return (
		<img
			src={LogoSources[variant][tone]}
			alt={LogoAlternativeText[variant]}
			className={logoStyles({ size, className })}
		/>
	);
}

export { Logo };
