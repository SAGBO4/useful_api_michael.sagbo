import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModulesStore = defineStore('modules', () => {
  const modules = ref({
    wallet: true,
    urlShortener: true,
    timeTracker: true
  });
  const error = ref('');
  const message = ref('');

  // ici on changes les modules depuis chrome.storage.local
  const loadModules = () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['modules'], (result) => {
        modules.value = result.modules || { wallet: true, urlShortener: true, timeTracker: true };
        resolve();
      });
    });
  };

  // Sauvegarde des modules
  const saveModules = () => {
    chrome.storage.local.set({ modules: modules.value });
  };

  // Activer/désactiver un module
  const toggleModule = (moduleName, enabled) => {
    if (moduleName in modules.value) {
      modules.value[moduleName] = enabled;
      saveModules();
      message.value = `Module ${moduleName} ${enabled ? 'activé' : 'désactivé'}`;
      error.value = '';
    } else {
      error.value = 'Module non trouvé';
      message.value = '';
    }
  };

  return { modules, error, message, loadModules, toggleModule };
});