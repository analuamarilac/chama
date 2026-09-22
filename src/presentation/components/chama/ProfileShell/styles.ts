import { tv } from "tailwind-variants";

const profileShellStyles = tv({
	slots: {
		root: "flex min-h-screen flex-col bg-background",
		header:
			"sticky top-0 z-20 border-border/60 border-b bg-background/95 backdrop-blur",
		headerInner:
			"mx-auto flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6",
		main: "mx-auto w-full flex-1 px-4 py-6 sm:px-6 sm:py-8",
	},
	variants: {
		/**
		 * A IDV define densidades diferentes por perfil: desktop para Solicitante
		 * e Admin, mobile-first para o Entregador. A aplicação segue responsiva
		 * nos dois casos — o que muda é a largura máxima de leitura confortável.
		 */
		width: {
			compact: {
				headerInner: "max-w-2xl",
				main: "max-w-2xl",
			},
			regular: {
				headerInner: "max-w-5xl",
				main: "max-w-5xl",
			},
			wide: {
				headerInner: "max-w-7xl",
				main: "max-w-7xl",
			},
		},
	},
	defaultVariants: {
		width: "regular",
	},
});

export { profileShellStyles };
