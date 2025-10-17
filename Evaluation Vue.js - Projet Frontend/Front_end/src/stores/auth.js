import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const error = ref('');
  const message = ref('');
  const users = ref([]);

  // Charge les données depuis localStorage
  const loadData = () => {
    const storedUser = localStorage.getItem('user');
    const storedUsers = localStorage.getItem('users');
    user.value = storedUser ? JSON.parse(storedUser) : null;
    users.value = storedUsers ? JSON.parse(storedUsers) : [];
  };

  // Sauvegarde de l'utilisateur
  const saveUser = (userData) => {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Sauvegarde la liste des utilisateurs
  const saveUsers = () => {
    localStorage.setItem('users', JSON.stringify(users.value));
  };

  // Valide l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation de mot de passe
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Inscription
  const register = async (email, password, confirmPassword) => {
    try {
      error.value = '';
      message.value = '';

      if (!validateEmail(email)) {
        error.value = 'Email invalide';
        return;
      }
      if (!validatePassword(password)) {
        error.value = 'Le mot de passe doit avoir au moins 6 caractères';
        return;
      }
      if (password !== confirmPassword) {
        error.value = 'Les mots de passe ne correspondent pas';
        return;
      }

      loadData();
      if (users.value.some(u => u.email === email)) {
        error.value = 'Cet email est déjà utilisé';
        return;
      }

      const userData = {
        email,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      users.value.push(userData);
      saveUser(userData);
      saveUsers();
      message.value = 'Inscription réussie !';
    } catch (err) {
      error.value = err.message || 'Erreur lors de l\'inscription';
      message.value = '';
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      error.value = '';
      message.value = '';

      if (!validateEmail(email)) {
        error.value = 'Email invalide';
        return;
      }
      if (!validatePassword(password)) {
        error.value = 'Mot de passe invalide';
        return;
      }

      loadData();
      const foundUser = users.value.find(u => u.email === email);
      if (!foundUser) {
        error.value = 'Email non trouvé';
        return;
      }
      if (password !== 'password123') {
        error.value = 'Mot de passe incorrect';
        return;
      }

      saveUser(foundUser);
      message.value = 'Connexion réussie !';
    } catch (err) {
      error.value = err.message || 'Erreur lors de la connexion';
      message.value = '';
    }
  };

  // Réinitialisation du mot de passe
  const forgotPassword = async (email) => {
    try {
      error.value = '';
      message.value = '';

      if (!validateEmail(email)) {
        error.value = 'Email invalide';
        return;
      }

      loadData();
      if (!users.value.some(u => u.email === email)) {
        error.value = 'Email non trouvé';
        return;
      }

      console.log('Demande de réinitialisation pour:', email);
      message.value = 'Lien de réinitialisation envoyé à ' + email;
    } catch (err) {
      error.value = err.message || 'Erreur lors de la demande de réinitialisation';
      message.value = '';
    }
  };

  // Déconnexion
  const logout = () => {
    user.value = null;
    localStorage.removeItem('user');
    message.value = 'Déconnexion réussie';
    error.value = '';
  };

  return { user, error, message, loadData, register, login, forgotPassword, logout };
});