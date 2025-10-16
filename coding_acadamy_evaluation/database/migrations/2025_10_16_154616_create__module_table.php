<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('_module', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });
    }

    public function up1(): void
    {
    Schema::create('modules', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->timestamps();
    });
    }

    public function up2(): void
    {
   Schema::create('user_modules', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('module_id')->constrained()->onDelete('cascade');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_module');
    }

    
};
