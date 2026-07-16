<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

    public function up(): void {
        Schema::create("payment_adapters", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->string("code" )->nullable();
            $table->string("title" )->nullable();
            $table->string("description" )->nullable();
            $table->char("currency_code" )->nullable();
            $table->decimal("total_amount" , 10, 2)->nullable();
            $table->boolean("is_active")->nullable();
            $table->comment("payment_adapters table");
        });
    }

    public function down(): void {
        Schema::dropIfExists('payment_adpaters');
    }

};