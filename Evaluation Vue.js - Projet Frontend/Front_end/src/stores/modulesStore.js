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

  // Charge les modules
  const loadModules = () => {
    const storedModules = localStorage.getItem('modules');
    modules.value = storedModules ? JSON.parse(storedModules) : { wallet: true, urlShortener: true, timeTracker: true };
  };

  // Sauvegarde les modules
  const saveModules = () => {
    localStorage.setItem('modules', JSON.stringify(modules.value));
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