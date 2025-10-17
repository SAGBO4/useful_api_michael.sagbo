import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const error = ref('');
  const message = ref('');

  // Chargeement de  l'utilisateur depuis chrome.storage.local au démarrage
  const loadUser = () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['user'], (result) => {
        user.value = result.user || null;
        resolve();
      });
    });
  };

  // ici je sauvegarder l'utilisateur dans chrome.storage.local
  const saveUser = (userData) => {
    user.value = userData;
    chrome.storage.local.set({ user: userData });
  };

  // Inscription
  const register = async (email, password) => {
    try {
      
      console.log('Inscription:', { email, password });
      const userData = { email, id: Date.now() }; 
      saveUser(userData);
      error.value = '';
      message.value = 'Inscription réussie !';
    } catch (err) {
      error.value = 'Erreur lors de l\'inscription';
      message.value = '';
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
     
      console.log('Connexion:', { email, password });
      const userData = { email, id: Date.now() }; // Simulation
      saveUser(userData);
      error.value = '';
      message.value = 'Connexion réussie !';
    } catch (err) {
      error.value = 'Erreur lors de la connexion';
      message.value = '';
    }
  };

  // Réinitialisation du mot de passe
  const forgotPassword = async (email) => {
    try {
      // Simulation d'une requête API vu que mon api ne marche pas
      console.log('Demande de réinitialisation pour:', email);
      error.value = '';
      message.value = 'Lien de réinitialisation envoyé à ' + email;
    } catch (err) {
      error.value = 'Erreur lors de la demande de réinitialisation';
      message.value = '';
    }
  };

  // Déconnexion
  const logout = () => {
    user.value = null;
    chrome.storage.local.remove('user');
    message.value = 'Déconnexion réussie';
    error.value = '';
  };

  return { user, error, message, loadUser, register, login, forgotPassword };
});