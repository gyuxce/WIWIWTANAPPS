<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

    public function up(): void {
        Schema::create("transactions", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("user_id")->nullable()->index();
            $table->string("number" )->nullable();
            $table->smallInteger("price_type")->nullable();
            $table->timestamp("issued_at")->nullable();
            $table->timestamp("expired_at")->nullable();
            $table->char("currency_code" )->nullable();
            $table->decimal("total_amount" , 10, 2)->nullable();
            $table->decimal("total" , 10, 2)->nullable();
            $table->decimal("total_left_amount" , 10, 2)->nullable();
            $table->smallInteger("status")->nullable();
            $table->comment("transactions table");
        });
    }

    public function down(): void {
        Schema::dropIfExists('transactions');
    }

};