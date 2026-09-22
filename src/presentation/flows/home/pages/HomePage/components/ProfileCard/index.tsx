import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "#/components/ui/button.tsx";

import { profileCardStyles } from "./styles.ts";
import type { ProfileCardProps } from "./types.ts";

/**
 * O cartão inteiro não é clicável: o botão é o único elemento interativo.
 * Aninhar um botão dentro de um link duplicaria a parada de teclado e deixaria
 * o alvo ambíguo para leitores de tela.
 */
function ProfileCard({
	to,
	icon: Icon,
	title,
	description,
	isPrimary = false,
}: ProfileCardProps) {
	const styles = profileCardStyles({ isPrimary });

	return (
		<article className={styles.root()}>
			<Icon
				aria-hidden="true"
				className={styles.icon({ class: "size-7" })}
				strokeWidth={1.5}
			/>

			<div className="flex flex-1 flex-col gap-1">
				<h3 className={styles.title()}>{title}</h3>
				<p className={styles.description()}>{description}</p>
			</div>

			<Button
				variant={isPrimary ? "default" : "outline"}
				asChild
				className={styles.action()}
			>
				<Link to={to}>
					Acessar visão
					<ArrowRight aria-hidden="true" className="size-4" />
					<span className="sr-only">de {title}</span>
				</Link>
			</Button>
		</article>
	);
}

export { ProfileCard };
