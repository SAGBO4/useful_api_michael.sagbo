<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    authStore.error = 'Les mots de passe ne correspondent pas';
    return;
  }
  await authStore.register(email.value, password.value);
  if (!authStore.error) {
    router.push('/');
  }
};
</script>

<template>
  <div class="register">
    <h2>Inscription</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div class="form-group">
        <label for="confirm-password">Confirmer le mot de passe</label>
        <input v-model="confirmPassword" type="password" id="confirm-password" required />
      </div>
      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
      <p v-if="authStore.message" class="success">{{ authStore.message }}</p>
      <button type="submit">S'inscrire</button>
      <button type="button" @click="router.push('/')" class="back-button">
        Retour à la connexion
      </button>
    </form>
  </div>
</template>

<style scoped>
.register {
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
button:hover {
  background-color: #0056b3;
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