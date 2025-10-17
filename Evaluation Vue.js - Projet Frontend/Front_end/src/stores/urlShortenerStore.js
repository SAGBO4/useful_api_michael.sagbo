import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUrlShortenerStore = defineStore('urlShortener', () => {
  const urls = ref([]);
  const error = ref('');
  const message = ref('');

  // Charge les URLs
  const loadUrls = () => {
    const storedUrls = localStorage.getItem('urls');
    urls.value = storedUrls ? JSON.parse(storedUrls) : [];
  };

  // Sauvegarde les URLs
  const saveUrls = () => {
    localStorage.setItem('urls', JSON.stringify(urls.value));
  };

  // Raccourcir une URL
  const shortenUrl = async (originalUrl) => {
    try {
      if (!originalUrl.startsWith('http')) throw new Error('L\'URL doit commencer par http:// ou https://');
      console.log('Raccourcissement de:', originalUrl);
      const shortUrl = `short-${Date.now()}`;
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
      error.value = err.message || 'Erreur lors du raccourcissement de l\'URL';
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