<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

    public function up(): void {
        Schema::create("payments", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("transaction_id")->nullable()->index();
            $table->bigInteger("installment_id")->nullable()->index();
            $table->timestamp("expired_at")->nullable();
            $table->string("adapter" )->nullable();
            $table->string("number" )->nullable();
            $table->string("number_ref" )->nullable();
            $table->char("currency_code" )->nullable();
            $table->decimal("amount" , 10, 2)->nullable();
            $table->decimal("fee" , 10, 2)->nullable();
            $table->decimal("tax" , 10, 2)->nullable();
            $table->decimal("total" , 10, 2)->nullable();
            $table->bigInteger("from_bank_id")->nullable()->index();
            $table->string("from_account_number" )->nullable();
            $table->string("from_account_name" )->nullable();
            $table->bigInteger("to_bank_id")->nullable()->index();
            $table->string("to_account_number" )->nullable();
            $table->string("to_account_name" )->nullable();
            $table->tinyInteger("index")->nullable();
            $table->bigInteger("file_id")->nullable()->index();
            $table->tinyInteger("status")->nullable()->comment('unpaid, partially paid, paid, failed/cancelled');
            $table->comment("payments table");
        });
    }

    public function down(): void {
        Schema::dropIfExists('payments');
    }

};