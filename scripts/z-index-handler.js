import { MODULE } from "./constants.js";

/**
 * Z-Index Handler for Token Action HUD Dragonbane
 * Manages forcing HUD above other Foundry windows
 */

let zIndexMonitor = null;

/**
 * Apply z-index to HUD elements
 */
const applyHudZIndex = () => {
  const hudApp = document.querySelector('#token-action-hud-app');
  if (hudApp) {
    hudApp.style.zIndex = '9999';
    const hudElement = document.querySelector('#token-action-hud');
    if (hudElement) {
      hudElement.style.zIndex = '10000';
    }
    console.log('Applied HUD z-index');
    return true;
  }
  return false;
};

/**
 * Start the z-index monitor
 */
const startZIndexMonitor = () => {
  if (zIndexMonitor) return; // Already running
  
  zIndexMonitor = setInterval(() => {
    if (game.settings.get(MODULE.ID, 'hudAboveWindows')) {
      const hudApp = document.querySelector('#token-action-hud-app');
      if (hudApp) {
        hudApp.style.zIndex = '9999';
        const hudElement = document.querySelector('#token-action-hud');
        if (hudElement) {
          hudElement.style.zIndex = '10000';
        }
      }
    }
  }, 1000);
  console.log('Started HUD z-index monitor');
};

/**
 * Stop the z-index monitor
 */
const stopZIndexMonitor = () => {
  if (zIndexMonitor) {
    clearInterval(zIndexMonitor);
    zIndexMonitor = null;
    console.log('Stopped HUD z-index monitor');
  }
};

/**
 * Reset HUD z-index to default
 */
const resetHudZIndex = () => {
  const hudApp = document.querySelector('#token-action-hud-app');
  const hudElement = document.querySelector('#token-action-hud');
  
  if (hudApp) hudApp.style.zIndex = '';
  if (hudElement) hudElement.style.zIndex = '';
  console.log('Reset HUD z-index');
};

/**
 * Initialize z-index handling hooks
 */
export function initializeZIndexHandling() {
  // Multiple hooks to catch the HUD whenever it's ready
  Hooks.once('ready', () => {
    if (game.settings.get(MODULE.ID, 'hudAboveWindows')) {
      console.log('Ready hook - checking for HUD');
      
      // Try immediately
      if (applyHudZIndex()) {
        startZIndexMonitor();
      } else {
        // If not ready, try with increasing delays
        const delays = [500, 1000, 2000, 3000, 5000];
        delays.forEach(delay => {
          setTimeout(() => {
            if (game.settings.get(MODULE.ID, 'hudAboveWindows') && applyHudZIndex()) {
              startZIndexMonitor();
            }
          }, delay);
        });
      }
    }
  });

  Hooks.on('tokenActionHudReady', () => {
    if (game.settings.get(MODULE.ID, 'hudAboveWindows')) {
      console.log('HUD ready hook - applying z-index');
      applyHudZIndex();
      startZIndexMonitor();
    }
  });

  // Additional hook for when canvas is ready
  Hooks.on('canvasReady', () => {
    if (game.settings.get(MODULE.ID, 'hudAboveWindows')) {
      console.log('Canvas ready hook - checking for HUD');
      setTimeout(() => {
        if (applyHudZIndex()) {
          startZIndexMonitor();
        }
      }, 1000);
    }
  });

  // Fallback: Watch for HUD element to appear
  Hooks.once('ready', () => {
    if (game.settings.get(MODULE.ID, 'hudAboveWindows')) {
      const observer = new MutationObserver(() => {
        if (applyHudZIndex()) {
          startZIndexMonitor();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Stop watching after 10 seconds
      setTimeout(() => observer.disconnect(), 10000);
    }
  });
}

/**
 * Handle z-index setting change
 */
export function handleZIndexSettingChange(value) {
  if (value) {
    console.log('Enabling HUD z-index');
    applyHudZIndex();
    startZIndexMonitor();
  } else {
    console.log('Disabling HUD z-index');
    stopZIndexMonitor();
    resetHudZIndex();
  }
}