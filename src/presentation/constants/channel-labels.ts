import { OriginChannel } from "#/domain/chama/types.ts";

/** Rótulos do canal pelo qual a loja abriu a solicitação. */
const OriginChannelLabel = {
	[OriginChannel.App]: "App",
	[OriginChannel.Web]: "Web",
} as const;

export { OriginChannelLabel };
