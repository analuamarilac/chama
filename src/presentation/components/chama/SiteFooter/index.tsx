import { Info } from "lucide-react";

import { Brand } from "#/presentation/constants/brand.ts";

/** Rodapé das páginas institucionais. */
function SiteFooter() {
	return (
		<footer className="border-border/60 border-t">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
				{/*
				 * A segunda frase atende ao requisito de deixar explícito que a troca
				 * de perfis é um recurso de avaliação, não do produto.
				 */}
				<p className="flex items-start gap-2 text-muted-foreground text-xs leading-relaxed">
					<Info aria-hidden="true" className="mt-px size-3.5 shrink-0" />
					<span>
						Entrada criada apenas para demonstração do protótipo. No produto
						real, cada perfil tem seu próprio acesso.
					</span>
				</p>

				<p className="text-muted-foreground text-xs">
					Design por {Brand.authorName} · {Brand.year}
				</p>
			</div>
		</footer>
	);
}

export { SiteFooter };
