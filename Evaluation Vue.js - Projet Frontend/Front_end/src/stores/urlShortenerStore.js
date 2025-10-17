import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUrlShortenerStore = defineStore('urlShortener', () => {
  const urls = ref([]);
  const error = ref('');
  const message = ref('');

  // Charger les URLs depuis chrome.storage.local
  const loadUrls = () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['urls'], (result) => {
        urls.value = result.urls || [];
        resolve();
      });
    });
  };

  // Sauvegarder les URLs
  const saveUrls = () => {
    chrome.storage.local.set({ urls: urls.value });
  };

  // Raccourcir une URL
  const shortenUrl = async (originalUrl) => {
    try {
      // Simulation d'une requête API (ex. : Bitly, TinyURL,kloome)
      console.log('Raccourcissement de:', originalUrl);
      const shortUrl = `short-${Date.now()}`; // Simulation d'un lien court
      const urlData = {
        id: Date.now(),
        original: originalUrl,
        short: shortUrl,
        createdAt: new Date().toISOString()
      };
      urls.value.push(urlData);
      saveUrls();
      error.value = '';
      message.value = 'URL raccourcie avec succès !';
      return shortUrl;
    } catch (err) {
      error.value = 'Erreur lors du raccourcissement de l\'URL';
      message.value = '';
    }
  };

  // Supprime une URL
  const deleteUrl = (urlId) => {
    urls.value = urls.value.filter(url => url.id !== urlId);
    saveUrls();
    message.value = 'URL supprimée';
    error.value = '';
  };

  return { urls, error, message, loadUrls, shortenUrl, deleteUrl };
});