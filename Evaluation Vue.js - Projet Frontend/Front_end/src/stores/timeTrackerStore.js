import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTimeTrackerStore = defineStore('timeTracker', () => {
  const sessions = ref([]);
  const error = ref('');
  const message = ref('');

  // Chargement  des sessions depuis chrome.storage.local
  const loadSessions = () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['sessions'], (result) => {
        sessions.value = result.sessions || [];
        resolve();
      });
    });
  };

  // Sauvegarde des sessions
  const saveSessions = () => {
    chrome.storage.local.set({ sessions: sessions.value });
  };

  // Démarage d'une session
  const startSession = (url) => {
    const session = {
      id: Date.now(),
      url,
      startTime: Date.now(),
      duration: 0 // En secondes
    };
    sessions.value.push(session);
    saveSessions();
    message.value = `Suivi démarré pour ${url}`;
    error.value = '';
  };

  // Mis à jour la durée d'une session
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

  // Arrêt d'une session
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