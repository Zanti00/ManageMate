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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
            $table->string('title');
            $table->text('description');
            $table->string('organization')->nullable();
            $table->smallInteger('attendees')->nullable();
            $table->smallInteger('registries')->nullable();
            $table->enum('status', ['pending', 'active', 'rejected', 'closed'])->default('pending');
            $table->date('start_date');
            $table->date('end_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->date('registration_start_date');
            $table->date('registration_end_date');
            $table->time('registration_start_time');
            $table->time('registration_end_time');
            $table->string('location');
            $table->double('price');
            $table->double('earnings')->nullable();
            $table->boolean('is_deleted')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
