<?php


namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    // Consulter le solde
    public function balance(Request $request)
    {
        $wallet = Wallet::firstOrCreate(
            ['user_id' => auth()->id()],
            ['balance' => 0.00]
        );

        return response()->json(['balance' => $wallet->balance]);
    }

    // Recharger le portefeuille
    public function deposit(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $wallet = Wallet::firstOrCreate(
            ['user_id' => auth()->id()],
            ['balance' => 0.00]
        );

        DB::transaction(function () use ($wallet, $validated) {
            $wallet->increment('balance', $validated['amount']);
            Transaction::create([
                'wallet_id' => $wallet->id,
                'user_id' => auth()->id(),
                'amount' => $validated['amount'],
                'type' => 'deposit',
                'description' => 'Recharge du portefeuille',
            ]);
        });

        return response()->json(['message' => 'Portefeuille rechargé', 'balance' => $wallet->balance]);
    }

    // Transférer à un autre utilisateur
    public function transfer(Request $request)
    {
        $validated = $request->validate([
            'recipient_email' => 'required|email|exists:users,email',
            'amount' => 'required|numeric|min:0.01',
        ]);

        $senderWallet = Wallet::firstOrCreate(
            ['user_id' => auth()->id()],
            ['balance' => 0.00]
        );

        if ($senderWallet->balance < $validated['amount']) {
            return response()->json(['message' => 'Solde insuffisant'], 400);
        }

        $recipient = User::where('email', $validated['recipient_email'])->first();
        $recipientWallet = Wallet::firstOrCreate(
            ['user_id' => $recipient->id],
            ['balance' => 0.00]
        );

        DB::transaction(function () use ($senderWallet, $recipientWallet, $validated, $recipient) {
            $senderWallet->decrement('balance', $validated['amount']);
            $recipientWallet->increment('balance', $validated['amount']);

            Transaction::create([
                'wallet_id' => $senderWallet->id,
                'user_id' => auth()->id(),
                'recipient_id' => $recipient->id,
                'amount' => $validated['amount'],
                'type' => 'transfer',
                'description' => 'Transfert vers ' . $recipient->email,
            ]);

            Transaction::create([
                'wallet_id' => $recipientWallet->id,
                'user_id' => $recipient->id,
                'recipient_id' => auth()->id(),
                'amount' => $validated['amount'],
                'type' => 'transfer',
                'description' => 'Reçu de ' . auth()->user()->email,
            ]);
        });

        return response()->json(['message' => 'Transfert effectué', 'balance' => $senderWallet->balance]);
    }

    // historique des transactions
    public function history(Request $request)
    {
        $wallet = Wallet::where('user_id', auth()->id())->firstOrFail();
        $transactions = Transaction::where('wallet_id', $wallet->id)
            ->with(['user', 'recipient'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['transactions' => $transactions]);
    }
}