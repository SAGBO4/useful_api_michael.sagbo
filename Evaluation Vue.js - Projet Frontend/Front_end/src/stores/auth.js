import { defineStore } from 'pinia';
import { ref } from 'vue';

// On crée un "magasin" nommé 'auth' pour gérer l'authentification.
export const useAuthStore = defineStore('auth', () => {
  // --- Les données ---
  const user = ref(null);      // L'utilisateur connecté.
  const error = ref('');       // Pour afficher un message d'erreur.
  const message = ref('');     // Pour afficher un message de succès.
  const users = ref([]);       // Une liste de tous les utilisateurs (pour l'exemple).

  // --- Les fonctions (actions) ---

  // Charge les données de l'utilisateur et la liste des utilisateurs depuis le stockage local du navigateur.
  const loadData = () => {
    user.value = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    users.value = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
  };

  // Enregistre un nouvel utilisateur.
  const register = async (email, password, confirmPassword) => {
    // ... (Logique de validation) ...

    loadData(); // Charge les utilisateurs existants avant de vérifier.
    if (users.value.some(u => u.email === email)) {
      error.value = 'Cet email est déjà utilisé'; // Si l'email existe, on s'arrête.
      return;
    }

    // Crée un nouvel utilisateur.
    const userData = { email, id: Date.now(), createdAt: new Date().toISOString() };
    users.value.push(userData); // Ajoute le nouvel utilisateur à la liste.
    localStorage.setItem('user', JSON.stringify(userData)); // Sauvegarde le nouvel utilisateur.
    localStorage.setItem('users', JSON.stringify(users.value)); // Sauvegarde la liste mise à jour.
    message.value = 'Inscription réussie !';
  };

  // Gère la connexion.
  const login = async (email, password) => {
    // ... (Logique de validation) ...

    loadData(); // Charge les utilisateurs existants.
    const foundUser = users.value.find(u => u.email === email);
    if (!foundUser) {
      error.value = 'Email non trouvé'; // Si l'email n'est pas dans la liste, on s'arrête.
      return;
    }

    // Ici, le mot de passe est 'password123' pour l'exemple.
    if (password !== 'password123') {
      error.value = 'Mot de passe incorrect'; // Si le mot de passe est faux, on s'arrête.
      return;
    }

    localStorage.setItem('user', JSON.stringify(foundUser)); // Enregistre l'utilisateur dans le stockage.
    user.value = foundUser; // Met à jour l'utilisateur connecté dans le store.
    message.value = 'Connexion réussie !';
  };

  // Gère la déconnexion.
  const logout = () => {
    user.value = null; // Efface l'utilisateur du store.
    localStorage.removeItem('user'); // Supprime l'utilisateur du stockage local.
    message.value = 'Déconnexion réussie';
  };

  // Retourne tout ce qui sera utilisé par les composants.
  return { user, error, message, loadData, register, login, logout };
});
