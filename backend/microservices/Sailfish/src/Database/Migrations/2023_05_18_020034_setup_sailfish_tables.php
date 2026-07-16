<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    // CREATE TABLE fcm_tokens (
    //  id int(11) NOT NULL AUTO_INCREMENT,
    //  token text NOT NULL,
    //  user_id int(11) NOT NULL,
    //  os varchar(20) NOT NULL,
    //  created_at date DEFAULT current_timestamp(),
    //  updated_at date DEFAULT current_timestamp(),
    //  deleted_at date DEFAULT NULL,
    //  PRIMARY KEY (id)
    // );

    public function up(): void
    {
        Schema::create("notifications", function (Blueprint $table) {
            $table->id();

            $table->string('sender');
            $table->string('recipient');
            $table->string('category');
            $table->string('title');
            $table->string('body');
            $table->text('template');
            $table->string('status');

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create("fcm_tokens", function (Blueprint $table) {
            $table->id();
            $table->bigInteger("user_id")->nullable()->unsigned()->index();
            $table->string('os', 20);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fcm_tokens');
    }
};