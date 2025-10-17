import { defineStore } from 'pinia';
import { ref } from 'vue';

// ici j'ai crée un "magasin" nommé 'wallet' pour gérer le portefeuille (solde et transactions).
export const useWalletStore = defineStore('wallet', () => {
  //  Bon on est dans les  données (l'état) 
  const balance = ref(0);         // Le solde du portefeuille est initialisé ici à zéro.
  const transactions = ref([]);   // Un tableau pour stocker toutes les transactions.
  const error = ref('');          // c'est crée pour afficher les messages d'erreur.
  const message = ref('');        // c'est crée pour Pour afficher les messages de succès.

  // Les fonctions  pour chaque actions

  //je  Charge le solde et les transactions depuis le stockage  localStorage.
  const loadWallet = () => {
    const storedWallet = localStorage.getItem('wallet');
    if (storedWallet) {
      const wallet = JSON.parse(storedWallet);
      balance.value = wallet.balance || 0;
      transactions.value = wallet.transactions || [];
    }
  };

  // Sauvegarde le solde et les transactions dans le stockage local.
  const saveWallet = () => {
    localStorage.setItem('wallet', JSON.stringify({ balance: balance.value, transactions: transactions.value }));
  };

  // Ajout d'une nouvelle transaction.
  const addTransaction = async (amount, type, description) => {
    try {
      if (amount <= 0) throw new Error('Le montant doit être positif'); // Vérifie que le montant est valide.
      const transaction = {
        id: Date.now(),      // ici j'ai crée un identifiant unique.
        amount,
        type,                // 'credit' pour un ajout, 'debit' pour un retrait.
        description,
        date: new Date().toISOString()
      };
      transactions.value.push(transaction); // ici j'ajoute la transaction au tableau.
      // Mis à jour le solde en fonction du type de transaction.
      if (type === 'credit') {
        balance.value += amount;
      } else if (type === 'debit') {
        balance.value -= amount;
      }
      saveWallet(); // Sauvegarde de  l'état mis à jour.
      error.value = '';
      message.value = `Transaction ${type} ajoutée !`;
    } catch (err) {
      error.value = err.message || 'Erreur lors de l\'ajout de la transaction';
      message.value = '';
    }
  };

  // j'ai Supprimé une transaction et met à jour le solde.
  const removeTransaction = (transactionId) => {
    const transaction = transactions.value.find(t => t.id === transactionId); // Trouve la transaction à supprimer.
    if (transaction) {
      // Filtre le tableau pour enlever la transaction.
      transactions.value = transactions.value.filter(t => t.id !== transactionId);
      // j'ai ajuste le solde dans le sens inverse de la transaction.
      if (transaction.type === 'credit') {
        balance.value -= transaction.amount;
      } else if (transaction.type === 'debit') {
        balance.value += transaction.amount;
      }
      saveWallet(); // Sauvegarde l'état mis à jour.
      message.value = 'Transaction supprimée';
      error.value = '';
    } else {
      error.value = 'Transaction non trouvée';
      message.value = '';
    }
  };

  // On retourne toutes les données et fonctions pour qu'elles soient utilisables par les composants.
  return { balance, transactions, error, message, loadWallet, addTransaction, removeTransaction };
});
