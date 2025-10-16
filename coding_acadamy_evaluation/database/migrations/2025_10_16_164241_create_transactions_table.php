<?php

// database/migrations/xxxx_create_transactions_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Utilisateur initiateur
            $table->foreignId('recipient_id')->nullable()->constrained('users')->onDelete('set null'); // Destinataire (optionnel pour recharges)
            $table->decimal('amount', 15, 2);
            $table->enum('type', ['deposit', 'transfer', 'withdrawal']); // Type de transaction
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}