<?php

use Spark\Database\Schema\Blueprint;
use Spark\Database\Schema\Schema;

return new class {
    public function up(): void
    {
        Schema::create('sms_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('recipient_phone');
            $table->text('body')->nullable();
            $table->integer('sms_template_id')->nullable();
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');
            $table->enum('provider', ['twilio', 'whatsapp'])->default('twilio');
            $table->integer('attempts')->default(0);
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('sms_template_id')->constrained()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sms_jobs');
    }
};