<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Models\Finance\PaymentContentItem;
use App\Http\Resources\V1\Finance\PaymentContentItemResource;
use App\Http\Requests\Api\V1\Finance\ApiPaymentContentItemRequest;
use App\Http\Resources\V1\Finance\PaymentContentResource;
use App\Models\Finance\PaymentContent;
use App\Services\BaseCrud\BaseCrud;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentContentItemController extends BaseCrud {

    public $model = PaymentContentItem::class;
    public $resource = PaymentContentItemResource::class;
    public $storeValidator = ApiPaymentContentItemRequest::class;
    public $updateValidator = ApiPaymentContentItemRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function addContentItem($id, Request $request)
    {
        if (!empty($this->abilityPolicyStore)) {
            $this->authorize($this->abilityPolicyStore, $this->model);
        }

        try {
            DB::beginTransaction();

            $contentItems = [];
            $totalContent = 0;
            if ($request->content_items) {
                $content = PaymentContent::with('items.child')->where('uuid', $id)->first();
                if ($content->items) {
                    foreach ($content->items as $item) {
                        $item->child()->delete();
                    }
                    $content->items()->delete();
                }

                foreach ($request->content_items as $key => $value) {
                    $validationResult = $this->validateChildren($value['child']);
                    if (isset($validationResult['error'])) {
                        return response()->json(['message' => $validationResult['error']], Response::HTTP_BAD_REQUEST);
                    }

                    $totalContent += 1;
                    $parent = new PaymentContentItem([
                        'title' => $value['title'],
                        'description' => $value['description'],
                        'is_header' => true,
                        'payment_content_id' => $content->id,
                        'index' => $key + 1
                    ]);

                    $parent->save();

                    foreach ($value['child'] as $key => $child) {
                        $item = [];
                        $item['payment_content_id'] = $content->id;
                        $item['description'] = $child['description'];
                        $item['title'] = $child['title'];
                        $item['language_type'] = $child['language_type'];
                        $item['parent_id'] = $parent->id;
                        $item['created_at'] = \Carbon\Carbon::now();
                        $item['updated_at'] = \Carbon\Carbon::now();
                        $item['uuid'] = Str::uuid()->toString();
                        array_push($contentItems, $item);
                    }
                }
                PaymentContentItem::insert($contentItems);
                $content->update([
                    'total_content' => $totalContent
                ]);
            }
            DB::commit();
            $data = PaymentContent::with('items.child')->where('uuid', $id)->first();
            return response()->json(
                new PaymentContentResource($data)
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    private function validateChildren($childs)
    {
        if (count($childs) !== 2) {
            return ['error' => "Judul & konten pembayaran wajib terdiri dari Bahasa Indonesia & Bahasa Jepang"];
        }
    
        $languageTypes = [];
        foreach ($childs as $child) {
            if (!isset($child['language_type'])) {
                return ['error' => "Judul & konten pembayaran wajib terdiri dari Bahasa Indonesia & Bahasa Jepang"];
            }
            $languageTypes[] = $child['language_type'];
        }

        $languageTypes = array_column($childs, 'language_type');
        if (!in_array(1, $languageTypes, true) || !in_array(2, $languageTypes, true)) {
            return ['error' => "Judul & konten pembayaran wajib terdiri dari Bahasa Indonesia & Bahasa Jepang"];
        }
    
        return ['success' => true];
    }

}
