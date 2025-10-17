<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const email = ref('');

const handleResetPassword = async () => {
  await authStore.forgotPassword(email.value);
  if (!authStore.error) {
    email.value = '';
  }
};
</script>
<!-- Template et styles inchangés -->

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
/* Styles responsifs inchangés */
.forgot-password {
  padding: 1.5rem;
  max-width: min(90vw, 400px);
  margin: 0 auto;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 0.75rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  margin-top: 0.5rem;
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
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  margin: 0.5rem 0;
}
.success {
  color: green;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  margin: 0.5rem 0;
}
@media (min-width: 600px) {
  .forgot-password {
    padding: 2rem;
  }
  .form-group {
    margin-bottom: 1.5rem;
  }
  button {
    padding: 1rem;
  }
}
@media (max-width: 300px) {
  .forgot-password {
    padding: 1rem;
  }
  input, button {
    font-size: 0.8rem;
  }
}
</style>