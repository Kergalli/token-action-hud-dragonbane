import { registerChatHooks } from "./chat-hooks.js";
import { MODULE, REQUIRED_CORE_MODULE_VERSION } from "./constants.js";
import { SystemManager } from "./system-manager.js";
import { initializeZIndexHandling } from "./z-index-handler.js";

Hooks.on("tokenActionHudCoreApiReady", async () => {
  const module = game.modules.get(MODULE.ID);
  module.api = {
    requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
    SystemManager,
  };
  Hooks.call("tokenActionHudSystemReady", module);

  registerChatHooks();
  initializeZIndexHandling();
});
