import { defineStore } from 'pinia';
import { ref } from 'vue';

// ici je crée un "magasin" nommé 'modules' pour gérer les différents modules de l'application.
export const useModulesStore = defineStore('modules', () => {
  //  Les données 
  const modules = ref({
    wallet: true,         // Définit si le module "wallet" est activé (true) ou désactivé (false).
    urlShortener: true,   // Statut du module "urlShortener".
    timeTracker: true     // Statut du module "timeTracker".
  });
  const error = ref('');       //  fait pour message d'erreur.
  const message = ref('');     //   message de succès ou d'information.

  //  Les fonctions 

  // Chargement les réglages des modules depuis le stockage local du navigateur.
  const loadModules = () => {
    const storedModules = localStorage.getItem('modules');
    // S'il y a des données, on les utilise. Sinon, on utilise les valeurs par défaut.
    modules.value = storedModules ? JSON.parse(storedModules) : { wallet: true, urlShortener: true, timeTracker: true };
  };

  // Sauvegarde des réglages actuels des modules dans le stockage local.
  const saveModules = () => {
    localStorage.setItem('modules', JSON.stringify(modules.value));
  };

  // activation ou  désactivation un module spécifique.
  const toggleModule = (moduleName, enabled) => {
    // je vérifie que le module existe bien dans la liste.
    if (moduleName in modules.value) {
      modules.value[moduleName] = enabled; // Mis à jour le statut du module.
      saveModules();                       // Sauvegarde de  la modification.
      message.value = `Module ${moduleName} ${enabled ? 'activé' : 'désactivé'}`; // Affichage un message de succès.
      error.value = '';
    } else {
      error.value = 'Module non trouvé';    // Si le module n'existe pas, on met un message d'erreur.
      message.value = '';
    }
  };

  // On retourne toutes les données et fonctions pour qu'elles soient utilisables par les composants.
  return { modules, error, message, loadModules, toggleModule };
});
