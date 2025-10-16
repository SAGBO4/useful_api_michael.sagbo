<?php

// database/migrations/xxxx_create_short_urls_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShortUrlsTable extends Migration
{
    public function up()
    {
        Schema::create('short_urls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Lien avec l'utilisateur
            $table->string('original_url');
            $table->string('short_code')->unique(); // Code unique pour le lien court
            $table->unsignedBigInteger('clicks')->default(0); // Compteur de clics
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('short_urls');
    }
}