<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    // CREATE TABLE IF NOT EXISTS users
    // (
    //     id         INT AUTO_INCREMENT PRIMARY KEY,
    //     email      VARCHAR(125) UNIQUE,
    //     username   VARCHAR(30) UNIQUE,
    //     nip        VARCHAR(125) UNIQUE,
    //     password   VARCHAR(2048) NOT NULL,
    //     is_active  BOOLEAN       NOT NULL DEFAULT TRUE,
    //     created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //     updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //     deleted_at TIMESTAMP
    // ) ENGINE = INNODB;

    // CREATE TABLE IF NOT EXISTS tokens
    // (
    //     id            VARCHAR(36) PRIMARY KEY,
    //     user_id       INT,
    //     refresh_token VARCHAR(2048),
    //     platform_id   INT       NOT NULL,
    //     is_blocked    BOOLEAN   NOT NULL DEFAULT FALSE,
    //     expires_at    TIMESTAMP NOT NULL,
    //     created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //     updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //     deleted_at    TIMESTAMP
    // ) ENGINE = INNODB;

    // CREATE TABLE IF NOT EXISTS otps
    // (
    //     id         INT AUTO_INCREMENT PRIMARY KEY,
    //     type       VARCHAR(255),
    //     receiver    VARCHAR(255),
    //     code       VARCHAR(2048),
    //     expires_at TIMESTAMP NOT NULL,
    //     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //     deleted_at TIMESTAMP
    // ) ENGINE = INNODB;

    public function up(): void
    {
        Schema::create("tokens", function (Blueprint $table) {
            $table->string("id", 36)->primary();
            $table->bigInteger("user_id")->nullable()->unsigned()->index();
            $table->string('refresh_token', 2048);
            $table->integer("platform_id")->nullable()->unsigned();
            $table->boolean("is_blocked")->default(false);
            $table->timestamp("expires_at")->nullable();
            $table->timestamps();
            $table->timestamp("deleted_at")->nullable();
        });

        Schema::create("otps", function (Blueprint $table) {
            $table->increments("id");
            $table->string("type");
            $table->string("receiver", 2048);
            $table->string("code");
            $table->timestamp("expires_at")->nullable();
            $table->timestamps();
            $table->timestamp("deleted_at")->nullable();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('tokens');
        Schema::dropIfExists('otps');
    }
};