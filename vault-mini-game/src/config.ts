import type { BgConfig } from "./prefabs/ParallaxBackground";

type Config = {
  backgrounds: Record<string, BgConfig>;
};

export default {
  backgrounds: {
    vault: {
      layers: [
        "bgVault",
        "door",
        "handleShadow",
        "handle",
      ],
      panSpeed: 0.2,
    },
  },

} as Config;
