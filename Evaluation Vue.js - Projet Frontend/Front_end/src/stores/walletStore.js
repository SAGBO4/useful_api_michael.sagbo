import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWalletStore = defineStore('wallet', () => {
  const balance = ref(0);
  const transactions = ref([]);
  const error = ref('');
  const message = ref('');

  // Charge les données
  const loadWallet = () => {
    const storedWallet = localStorage.getItem('wallet');
    if (storedWallet) {
      const wallet = JSON.parse(storedWallet);
      balance.value = wallet.balance || 0;
      transactions.value = wallet.transactions || [];
    }
  };

  // Sauvegarde le portefeuille
  const saveWallet = () => {
    localStorage.setItem('wallet', JSON.stringify({ balance: balance.value, transactions: transactions.value }));
  };

  // Ajoute une transaction
  const addTransaction = async (amount, type, description) => {
    try {
      if (amount <= 0) throw new Error('Le montant doit être positif');
      console.log('Transaction:', { amount, type, description });
      const transaction = {
        id: Date.now(),
        amount,
        type,
        description,
        date: new Date().toISOString()
      };
      transactions.value.push(transaction);
      if (type === 'credit') {
        balance.value += amount;
      } else if (type === 'debit') {
        balance.value -= amount;
      }
      saveWallet();
      error.value = '';
      message.value = `Transaction ${type} ajoutée !`;
    } catch (err) {
      error.value = err.message || 'Erreur lors de l\'ajout de la transaction';
      message.value = '';
    }
  };

  // Supprimer une transaction
  const removeTransaction = (transactionId) => {
    const transaction = transactions.value.find(t => t.id === transactionId);
    if (transaction) {
      transactions.value = transactions.value.filter(t => t.id !== transactionId);
      if (transaction.type === 'credit') {
        balance.value -= transaction.amount;
      } else if (transaction.type === 'debit') {
        balance.value += transaction.amount;
      }
      saveWallet();
      message.value = 'Transaction supprimée';
      error.value = '';
    } else {
      error.value = 'Transaction non trouvée';
      message.value = '';
    }
  };

  return { balance, transactions, error, message, loadWallet, addTransaction, removeTransaction };
});