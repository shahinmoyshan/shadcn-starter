<?php

use Spark\Database\Schema\Blueprint;
use Spark\Database\Schema\Schema;

return new class {
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->nullable();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->integer('job_id')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('user_id')->constrained()->onDelete('set null');
            $table->index('job_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};