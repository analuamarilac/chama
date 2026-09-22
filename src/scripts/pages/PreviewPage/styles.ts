import { tv } from "tailwind-variants";

const previewPage = tv({
	slots: {
		root: "container mx-auto flex flex-col gap-8 px-6 py-12",
		header: "flex flex-col gap-2",
		title: "font-bold text-3xl tracking-tight",
		subtitle: "text-muted-foreground",
		grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
		card: "group/preview cursor-pointer gap-0 p-0 transition-colors hover:ring-foreground/30",
		thumbnailWrapper: "aspect-video w-full overflow-hidden bg-muted",
		thumbnail:
			"size-full object-cover object-top transition-transform duration-300 group-hover/preview:scale-[1.02]",
		body: "flex flex-col gap-1 p-4",
	},
});

export { previewPage };
