<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

    public function up(): void {
        Schema::create("prices", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->tinyInteger("type")->nullable()->comment('administrasi, pelatihan');
            $table->string("type_label")->nullable();

            $table->tinyInteger("subtype")->nullable()->comment('online, offline');
            $table->bigInteger("program_id")->nullable()->index();
            $table->decimal("amount" , 10, 2)->nullable();
            $table->bigInteger("training_letter_file_id")->nullable()->index();
            $table->bigInteger("installment_letter_file_id")->nullable()->index();
            $table->char("currency_code" )->nullable();
            $table->boolean("is_active" )->nullable();
            $table->comment("price table");
        });
    }

    public function down(): void {
        Schema::dropIfExists('prices');
    }

};