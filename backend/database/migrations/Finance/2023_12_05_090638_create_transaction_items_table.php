<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

    public function up(): void {
        Schema::create("transaction_items", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("transaction_id")->nullable()->index();
            $table->bigInteger("program_id")->nullable()->index();
            $table->string("title" )->nullable();
            $table->string("description" )->nullable();
            $table->decimal("amount", 10, 2)->nullable();
            $table->integer("quantity")->nullable();
            $table->boolean("is_tax")->nullable();
            $table->decimal("total" , 10, 2)->nullable();
            $table->comment("transaction_items table");
        });
    }

    public function down(): void {
        Schema::dropIfExists('transaction_items');
    }

};