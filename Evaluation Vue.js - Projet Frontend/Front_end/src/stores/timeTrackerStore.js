import { defineStore } from 'pinia';
import { ref } from 'vue';

// ici j'ai crée un "magasin" nommé 'timeTracker' pour gérer les sessions de suivi du temps.
export const useTimeTrackerStore = defineStore('timeTracker', () => {
  //  Les données 
  const sessions = ref([]); 
  const error = ref('');    
  const message = ref('');   

  //  Les fonctions 

  // Chargement les sessions depuis le stockage local (localStorage).
  const loadSessions = () => {
    const storedSessions = localStorage.getItem('sessions');
    // Si des sessions existent, on les utilise. Sinon, on démarre avec un tableau vide.
    sessions.value = storedSessions ? JSON.parse(storedSessions) : [];
  };

  // Sauvegarde  de toutes les sessions dans le stockage local.
  const saveSessions = () => {
    localStorage.setItem('sessions', JSON.stringify(sessions.value));
  };

  // start d'une nouvelle session de suivi pour une URL donnée.
  const startSession = (url) => {
    const session = {
      id: Date.now(),      // Création un identifiant unique basé sur l'heure actuelle.
      url,                 // L'URL que l'on suit.
      startTime: Date.now(), // L'heure de début.
      duration: 0          // La durée initiale est zéro.
    };
    sessions.value.push(session); // j'ajoute la nouvelle session à la liste.
    saveSessions();               // Sauvegarde de  la liste mise à jour toujour....
    message.value = `Suivi démarré pour ${url}`; // Affichage d'un message de succès.
  };

  // Mis à jour la durée d'une session existante.
  const updateSession = (sessionId, duration) => {
    const session = sessions.value.find(s => s.id === sessionId); // Trouve la bonne session par son ID.
    if (session) {
      session.duration = duration; // Mis à jour la durée.
      saveSessions();
      message.value = 'Session mise à jour';
    } else {
      error.value = 'Session non trouvée';
    }
  };

  // j'arrête une session et calcule sa durée totale.
  const stopSession = (sessionId) => {
    const session = sessions.value.find(s => s.id === sessionId); // Trouve la bonne session.
    if (session) {
      // Calcule  de la durée totale en secondes.
      session.duration = Math.floor((Date.now() - session.startTime) / 1000);
      saveSessions();
      message.value = 'Session arrêtée';
    } else {
      error.value = 'Session non trouvée';
    }
  };

  // On retourne toutes les données et fonctions pour qu'elles soient utilisables par les composants.
  return { sessions, error, message, loadSessions, startSession, updateSession, stopSession };
});
