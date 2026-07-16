<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

    public function up(): void {
        Schema::create("payment_proofs", function (Blueprint $table) {$table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("user_id")->nullable()->index();
            $table->bigInteger("payment_id")->nullable()->index();
            $table->bigInteger("transaction_id")->nullable()->index();
            $table->bigInteger("installment_id")->nullable()->index();
            $table->timestamp("date")->nullable();
            $table->string("adapter" )->nullable();
            $table->char("currency_code" )->nullable();
            $table->decimal("amount" , 10, 2)->nullable();
            $table->bigInteger("from_bank_id")->nullable()->index();
            $table->string("from_account_number" )->nullable();
            $table->string("from_account_name" )->nullable();
            $table->bigInteger("to_bank_id")->nullable()->index();
            $table->string("to_account_number" )->nullable();
            $table->string("to_account_name" )->nullable();
            $table->tinyInteger("status")->nullable()->comment('submitted, approved, denied');
            $table->bigInteger("file_id")->nullable()->index();
            $table->comment("payment_proofs table");
        });
    }


    public function down(): void {
        Schema::dropIfExists('payment_proofs');
    }

};