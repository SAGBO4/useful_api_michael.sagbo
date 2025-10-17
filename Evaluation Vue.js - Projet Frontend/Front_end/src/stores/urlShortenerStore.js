import { defineStore } from 'pinia';
import { ref } from 'vue';

// ici j'ai crée un "magasin" nommé 'urlShortener' pour gérer les URLs raccourcies.
export const useUrlShortenerStore = defineStore('urlShortener', () => {
  // Les données 
  const urls = ref([]);       // Un tableau pour stocker toutes les URLs.
  const error = ref('');      // Pour afficher les erreurs.
  const message = ref('');    // Pour afficher les messages de succès.

  //  Les fonctions 

  // Chargement les URLs depuis le stockage local (localStorage).
  const loadUrls = () => {
    const storedUrls = localStorage.getItem('urls');
    // Si des URLs existent, on les utilise. Sinon, on démarre avec un tableau vide.
    urls.value = storedUrls ? JSON.parse(storedUrls) : [];
  };

  // ici je sauvegarde toutes les URLs dans le stockage local.
  const saveUrls = () => {
    localStorage.setItem('urls', JSON.stringify(urls.value));
  };

  // Raccourcit une URL donnée.
  const shortenUrl = async (originalUrl) => {
    try {
      if (!originalUrl.startsWith('http')) throw new Error('L\'URL doit commencer par http:// ou https://'); // Vérifie le format de l'URL.
      console.log('Raccourcissement de:', originalUrl);
      const shortUrl = `short-${Date.now()}`; // Création d'une URL raccourcie unique.
      const urlData = {
        id: Date.now(),
        original: originalUrl,
        short: shortUrl,
        createdAt: new Date().toISOString()
      };
      urls.value.push(urlData); // Ajout de  la nouvelle URL à la liste.
      saveUrls();               // Sauvegarde  de la liste mise à jour.
      error.value = '';
      message.value = 'URL raccourcie avec succès !';
      return shortUrl; // Retourne l'URL raccourcie.
    } catch (err) {
      error.value = err.message || 'Erreur lors du raccourcissement de l\'URL';
      message.value = '';
    }
  };

  // ici on supprime une URL de la liste.
  const deleteUrl = (urlId) => {
    // Création d'un nouveau tableau sans l'URL qui a l'ID correspondant.
    urls.value = urls.value.filter(url => url.id !== urlId);
    saveUrls(); // Sauvegarde la liste mise à jour.
    message.value = 'URL supprimée';
    error.value = '';
  };

  // On retourne toutes les données et fonctions pour qu'elles soient utilisables par les composants.
  return { urls, error, message, loadUrls, shortenUrl, deleteUrl };
});
