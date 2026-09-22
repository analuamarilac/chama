import type { LinkOptions } from "@tanstack/react-router";

type PreviewRoute = {
	path: LinkOptions["to"];
	title: string;
	description: string;
	image: string;
};

export type { PreviewRoute };
