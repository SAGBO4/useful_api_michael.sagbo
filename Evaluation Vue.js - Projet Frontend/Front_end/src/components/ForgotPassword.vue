<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const email = ref('');

const handleResetPassword = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    authStore.error = 'Veuillez entrer un email valide';
    return;
  }
  await authStore.forgotPassword(email.value);
  if (!authStore.error) {
    email.value = '';
  }
};
</script>

<template>
  <div class="forgot-password">
    <h2>Réinitialiser le mot de passe</h2>
    <p>Entrez votre email pour recevoir un lien de réinitialisation.</p>
    <form @submit.prevent="handleResetPassword">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
      <p v-if="authStore.message" class="success">{{ authStore.message }}</p>
      <button type="submit">Envoyer</button>
      <button type="button" @click="router.push('/')" class="back-button">
        Retour à la connexion
      </button>
    </form>
  </div>
</template>

<style scoped>
.forgot-password {
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
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
button:hover {
  background-color: #c82333;
}
.back-button {
  background-color: #6c757d;
}
.back-button:hover {
  background-color: #5a6268;
}
.error {
  color: red;
  font-size: 14px;
}
.success {
  color: green;
  font-size: 14px;
}
</style>