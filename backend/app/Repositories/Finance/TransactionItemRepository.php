<?php

namespace App\Repositories\Finance;

use App\Models\Finance\TransactionItem;
use App\Repositories\BaseRepository;

class TransactionItemRepository extends BaseRepository
{
    public function createTransactionItem($transaction, $program_id)
    {
        $dtoTransactionItem = [
            "transaction_id" => $transaction->id,
            "total" => $transaction->total_amount,
            "program_id" => $program_id,
        ];
        $query = TransactionItem::create($dtoTransactionItem);
        return $query;
    }
}