<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreatePaymentDetailsTable extends Migration {

	public function up()
	{
		Schema::create('payment_details', function(Blueprint $table) {
			$table->id("id");
			$table->uuid("uuid")->nullable()->index();

            $table->bigInteger('payment_id')->nullable()->index();
            $table->bigInteger("adapter_id")->nullable()->index();
			$table->string('number', 200)->index()->nullable();
            $table->string('checkout_url', 400)->index()->nullable();
			$table->timestamp("expired_at")->nullable();
			$table->timestamp("paid_at")->nullable();
			$table->json('data_request')->nullable();
            $table->json('data_callback')->nullable();

			$table->timestamps();
			$table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->softDeletes();
		});
	}

	public function down()
	{
		Schema::drop('payment_details');
	}
}
