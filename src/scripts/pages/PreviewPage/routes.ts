import xprintsConfig from "#/xprints.json";
import type { PreviewRoute } from "./types";

const PreviewRoutes = xprintsConfig.previews as readonly PreviewRoute[];

export { PreviewRoutes };
