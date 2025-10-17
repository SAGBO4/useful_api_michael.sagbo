<script setup>
import { useAuthStore } from '../stores/auth';
import { useWalletStore } from '../stores/walletStore';
import { useUrlShortenerStore } from '../stores/urlShortenerStore';
import { useTimeTrackerStore } from '../stores/timeTrackerStore';
import { useModulesStore } from '../stores/modulesStore';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const walletStore = useWalletStore();
const urlShortenerStore = useUrlShortenerStore();
const timeTrackerStore = useTimeTrackerStore();
const modulesStore = useModulesStore();
const router = useRouter();

const transactionAmount = ref(0);
const transactionDescription = ref('');
const transactionType = ref('credit');
const newUrl = ref('');

onMounted(async () => {
  await authStore.loadData();
  await walletStore.loadWallet();
  await urlShortenerStore.loadUrls();
  await timeTrackerStore.loadSessions();
  await modulesStore.loadModules();
  if (!authStore.user) {
    router.push('/');
  }
});


const addTransaction = async () => {
  if (transactionAmount.value <= 0) {
    walletStore.error = 'Le montant doit être positif';
    return;
  }
  await walletStore.addTransaction(
    transactionAmount.value,
    transactionType.value,
    transactionDescription.value
  );
  transactionAmount.value = 0;
  transactionDescription.value = '';
};

const shortenUrl = async () => {
  if (!newUrl.value.startsWith('http')) {
    urlShortenerStore.error = 'L\'URL doit commencer par http:// ou https://';
    return;
  }
  await urlShortenerStore.shortenUrl(newUrl.value);
  newUrl.value = '';
};

const startTracking = () => {
  timeTrackerStore.startSession(window.location.href);
};
</script>

<template>
  <div class="dashboard">
    <h2>Bienvenue, {{ authStore.user?.email }}</h2>
    <button @click="authStore.logout">Déconnexion</button>
    <p v-if="authStore.message" class="success">{{ authStore.message }}</p>

    <!-- Wallet -->
    <div v-if="modulesStore.modules.wallet" class="module">
      <h3>Portefeuille</h3>
      <p>Solde : {{ walletStore.balance }} €</p>
      <input v-model.number="transactionAmount" type="number" placeholder="Montant" />
      <input v-model="transactionDescription" placeholder="Description" />
      <button @click="addTransaction">Ajouter transaction</button>
      <p v-if="walletStore.message" class="success">{{ walletStore.message }}</p>
      <p v-if="walletStore.error" class="error">{{ walletStore.error }}</p>
    </div>

    <!-- URL Shortener -->
    <div v-if="modulesStore.modules.urlShortener" class="module">
      <h3>Raccourcisseur d'URL</h3>
      <input v-model="newUrl" placeholder="Entrez une URL" />
      <button @click="shortenUrl">Raccourcir</button>
      <ul>
        <li v-for="url in urlShortenerStore.urls" :key="url.id">
          {{ url.original }} → {{ url.short }}
          <button @click="urlShortenerStore.deleteUrl(url.id)">Supprimer</button>
        </li>
      </ul>
      <p v-if="urlShortenerStore.message" class="success">{{ urlShortenerStore.message }}</p>
      <p v-if="urlShortenerStore.error" class="error">{{ urlShortenerStore.error }}</p>
    </div>

    <!-- Time Tracker -->
    <div v-if="modulesStore.modules.timeTracker" class="module">
      <h3>Suivi du temps</h3>
      <button @click="startTracking">Démarrer le suivi</button>
      <ul>
        <li v-for="session in timeTrackerStore.sessions" :key="session.id">
          {{ session.url }} : {{ session.duration }}s
          <button @click="timeTrackerStore.stopSession(session.id)">Arrêter</button>
        </li>
      </ul>
      <p v-if="timeTrackerStore.message" class="success">{{ timeTrackerStore.message }}</p>
      <p v-if="timeTrackerStore.error" class="error">{{ timeTrackerStore.error }}</p>
    </div>

    <!-- Gestion des modules -->
    <div class="module">
      <h3>Gérer les modules</h3>
      <label>
        <input type="checkbox" v-model="modulesStore.modules.wallet" @change="modulesStore.toggleModule('wallet', modulesStore.modules.wallet)" />
        Portefeuille
      </label>
      <label>
        <input type="checkbox" v-model="modulesStore.modules.urlShortener" @change="modulesStore.toggleModule('urlShortener', modulesStore.modules.urlShortener)" />
        Raccourcisseur d'URL
      </label>
      <label>
        <input type="checkbox" v-model="modulesStore.modules.timeTracker" @change="modulesStore.toggleModule('timeTracker', modulesStore.modules.timeTracker)" />
        Suivi du temps
      </label>
      <p v-if="modulesStore.message" class="success">{{ modulesStore.message }}</p>
      <p v-if="modulesStore.error" class="error">{{ modulesStore.error }}</p>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1.5rem;
  max-width: min(90vw, 400px);
  margin: 0 auto;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

h2, h3 {
  font-size: clamp(1rem, 3vw, 1.2rem);
}

.module {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  margin-bottom: 0.5rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  margin-top: 0.5rem;
}

button:hover {
  background-color: #0056b3;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
}

.error {
  color: red;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
}

.success {
  color: green;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
}

@media (min-width: 600px) {
  .dashboard {
    padding: 2rem;
  }
  button {
    padding: 1rem;
  }
}

@media (max-width: 300px) {
  .dashboard {
    padding: 1rem;
  }
  input, button {
    font-size: 0.8rem;
  }
}
</style>