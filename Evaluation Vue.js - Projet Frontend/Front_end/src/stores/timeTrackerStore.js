import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTimeTrackerStore = defineStore('timeTracker', () => {
  const sessions = ref([]);
  const error = ref('');
  const message = ref('');

  // Charge les sessions
  const loadSessions = () => {
    const storedSessions = localStorage.getItem('sessions');
    sessions.value = storedSessions ? JSON.parse(storedSessions) : [];
  };

  // Sauvegarde les sessions
  const saveSessions = () => {
    localStorage.setItem('sessions', JSON.stringify(sessions.value));
  };

  // Démarre la session
  const startSession = (url) => {
    const session = {
      id: Date.now(),
      url,
      startTime: Date.now(),
      duration: 0
    };
    sessions.value.push(session);
    saveSessions();
    message.value = `Suivi démarré pour ${url}`;
    error.value = '';
  };

  // Mettre à jour la durée d'une session
  const updateSession = (sessionId, duration) => {
    const session = sessions.value.find(s => s.id === sessionId);
    if (session) {
      session.duration = duration;
      saveSessions();
      message.value = 'Session mise à jour';
      error.value = '';
    } else {
      error.value = 'Session non trouvée';
      message.value = '';
    }
  };

  // Arrêter une session
  const stopSession = (sessionId) => {
    const session = sessions.value.find(s => s.id === sessionId);
    if (session) {
      session.duration = Math.floor((Date.now() - session.startTime) / 1000);
      saveSessions();
      message.value = 'Session arrêtée';
      error.value = '';
    } else {
      error.value = 'Session non trouvée';
      message.value = '';
    }
  };

  return { sessions, error, message, loadSessions, startSession, updateSession, stopSession };
});