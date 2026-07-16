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
        Schema::create('payment_content_items', function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("payment_content_id")->nullable()->index();
            $table->bigInteger("parent_id")->nullable()->index();
            $table->integer("index")->nullable();
            $table->string("title" )->nullable();
            $table->string("description" )->nullable();
            $table->boolean("is_header")->nullable()->default(false);
            $table->integer("language_type")->nullable();
            $table->comment("payment_content_items table");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_content_items');
    }
};
