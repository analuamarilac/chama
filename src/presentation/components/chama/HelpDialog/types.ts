interface HelpDialogProps {
	/**
	 * Modo controlado, para abrir a ajuda a partir de outro menu.
	 * Quando informado, o gatilho próprio não é renderizado.
	 */
	open?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
}

export type { HelpDialogProps };
