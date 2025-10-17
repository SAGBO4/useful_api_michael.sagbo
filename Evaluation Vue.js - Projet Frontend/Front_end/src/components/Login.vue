<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');

onMounted(async () => {
  await authStore.loadData(); // Changé de loadUser à loadData
  if (authStore.user) {
    router.push('/dashboard');
  }
});

const handleLogin = async () => {
  await authStore.login(email.value, password.value);
  if (!authStore.error) {
    router.push('/dashboard');
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
/* Styles responsifs inchangés */
.login {
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
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  margin-top: 0.5rem;
}
button:hover {
  background-color: #218838;
}
.forgot-password-button, .register-button {
  background: none;
  color: #007bff;
  border: none;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  text-align: left;
}
.forgot-password-button:hover, .register-button:hover {
  text-decoration: underline;
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
  .login {
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
  .login {
    padding: 1rem;
  }
  input, button {
    font-size: 0.8rem;
  }
}
</style>