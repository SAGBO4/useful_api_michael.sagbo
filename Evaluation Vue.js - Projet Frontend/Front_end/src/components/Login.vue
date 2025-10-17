<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');

onMounted(async () => {
  await authStore.loadUser();
  if (authStore.user) {
    router.push('/'); // Rediriger si déjà connecté
  }
});

const handleLogin = async () => {
  await authStore.login(email.value, password.value);
  if (!authStore.error) {
    router.push('/');
  }
};
</script>

<template>
  <div class="login">
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
      <p v-if="authStore.message" class="success">{{ authStore.message }}</p>
      <button type="submit">Se connecter</button>
      <button type="button" @click="router.push('/forgot-password')" class="forgot-password-button">
        Mot de passe oublié ?
      </button>
      <button type="button" @click="router.push('/register')" class="register-button">
        Créer un compte
      </button>
    </form>
  </div>
</template>

<style scoped>
.login {
  padding: 20px;
  max-width: 300px;
  font-family: Arial, sans-serif;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
button:hover {
  background-color: #218838;
}
.forgot-password-button, .register-button {
  background: none;
  color: #007bff;
  border: none;
  font-size: 14px;
  text-align: left;
}
.forgot-password-button:hover, .register-button:hover {
  text-decoration: underline;
}
.error {
  color: red;
  font-size: 14px;
}
.success {
  color: green;
  font-size: 14px;
}


/* Styles généraux et variables */
:root {
    --couleur-primaire: #007bff;
    --couleur-secondaire: #f8f9fa;
    --couleur-texte: #333;
    --couleur-fond: #fff;
}

body {
    font-family: Arial, sans-serif;
    margin: 0;
    line-height: 1.6;
    background-color: var(--couleur-secondaire);
    color: var(--couleur-texte);
}

/* En-tête */
header {
    background-color: var(--couleur-primaire);
    color: var(--couleur-fond);
    padding: 1rem 2rem;
    text-align: center;
}

header h1 {
    margin: 0;
}

nav a {
    color: var(--couleur-fond);
    text-decoration: none;
    margin: 0 1rem;
    font-weight: bold;
}

/* Conteneur principal et cartes */
.container {
    padding: 2rem;
    display: flex; /* Utilise Flexbox pour un affichage flexible */
    flex-wrap: wrap; /* Permet aux cartes de passer à la ligne */
    gap: 2rem; /* Espacement entre les cartes */
    justify-content: center;
}

.card {
    background-color: var(--couleur-fond);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    flex: 1 1 300px; /* Les cartes peuvent grandir ou rétrécir avec une taille de base de 300px*/
}

/* Pied de page */
footer {
    background-color: var(--couleur-texte);
    color: var(--couleur-fond);
    text-align: center;
    padding: 1rem;
}

/* Media query pour les petits écrans (smartphones) */
@media (max-width: 600px) {
    header {
        padding: 1rem;
    }

    nav a {
        display: block; /* Les liens s'affichent un par un */
        margin: 0.5rem 0;
    }

    .container {
        padding: 1rem;
    }
}

</style>