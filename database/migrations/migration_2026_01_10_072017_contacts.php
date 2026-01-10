<?php

use Spark\Database\Schema\Blueprint;
use Spark\Database\Schema\Schema;

return new class {
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 100)->nullable();
            $table->string('last_name', 100)->nullable();
            $table->string('email', 150)->required()->unique();
            $table->string('phone', 20)->nullable();
            $table->string('avatar', 200)->nullable();
            $table->string('organization', 150)->nullable();
            $table->string('address', 255)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 100)->nullable();
            $table->string('timezone', 100)->nullable();
            $table->string('contact_type')->nullable();
            $table->string('source')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->default('male');
            $table->date('birthdate')->nullable();
            $table->timestamps();
            $table->index(['first_name', 'last_name']);
            $table->index('phone');
            $table->index('contact_type');
            $table->index('organization');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};