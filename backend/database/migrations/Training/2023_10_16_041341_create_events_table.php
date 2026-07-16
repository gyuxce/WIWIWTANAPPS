<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

public function up(): void {
Schema::create("events", function (Blueprint $table) {$table->id("id");
$table->uuid("uuid")->nullable()->index();
$table->timestamps();
$table->softDeletes();
$table->bigInteger("created_by")->nullable()->unsigned()->index();
$table->bigInteger("updated_by")->nullable()->unsigned()->index();
$table->bigInteger("deleted_by")->nullable()->unsigned()->index();
$table->string("title" )->nullable();
$table->text("description")->nullable();
$table->timestamp("from")->nullable();
$table->timestamp("to")->nullable();
$table->timestamp("started_at")->nullable();
$table->timestamp("finished_at")->nullable();
$table->bigInteger("recording_file_id")->nullable()->index();
$table->string("external_url" )->nullable();
$table->string("external_passkey" )->nullable();
$table->smallInteger("status")->nullable();
$table->bigInteger("cover_file_id")->nullable()->index();
$table->integer("participant_max")->nullable();
$table->boolean("is_online")->nullable()->default(true);
$table->bigInteger("address_id")->nullable()->index();
$table->boolean("is_active")->nullable()->default(false);
$table->comment("events");});
}



public function down(): void {
Schema::dropIfExists('events');
}

};