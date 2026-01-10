<?php

use Spark\Database\Schema\Blueprint;
use Spark\Database\Schema\Schema;

return new class {
    public function up(): void
    {
        Schema::create('contacts_meta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->string('meta_key');
            $table->text('meta_value')->nullable();
            $table->unique(['contact_id', 'meta_key']);
            $table->index('meta_key');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts_meta');
    }
};