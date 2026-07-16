<?php

namespace App\Services\Excel;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class Excel
{
    public function excelSeeder($file)
    {
        //$file = base_path() . '/database/seeders/data/' . $file . '.xlsx';
        $spreadsheet = IOFactory::load($file);
        $sheetNames = $spreadsheet->getSheetNames();

        foreach ($sheetNames as $sheetName) {
            $worksheet = $spreadsheet->getSheetByName($sheetName);

            $sheetData = [];
            $header = [];

            foreach ($worksheet->getRowIterator() as $key => $row) {
                $rowData = [];

                $isEmpty = true;
                $tempRowData = [];
                foreach ($row->getCellIterator() as $cell) {
                    if (!empty($cell->getValue())) {
                        $isEmpty = false;
                    }
                    $tempRowData[] = $cell->getValue();
                }

                if (!$isEmpty) {
                    $rowData = $tempRowData;


                    if (empty($header)) {
                        $header = $rowData;
                        unset($header[""]);
                    } else {

                        $rowAsAssoc = array_combine($header, $rowData);
                        unset($rowAsAssoc[""]);


                        if (array_key_exists("uuid", $rowAsAssoc) && empty($rowAsAssoc["uuid"])) {
                            $rowAsAssoc["uuid"] = Str::uuid()->toString();
                        }

                        if (array_key_exists("created_at", $rowAsAssoc) && empty($rowAsAssoc["created_at"])) {
                            $rowAsAssoc["created_at"] = Carbon::now()->format("Y-m-d H:i:s");
                        }

                        if (array_key_exists("updated_at", $rowAsAssoc) && empty($rowAsAssoc["updated_at"])) {
                            $rowAsAssoc["updated_at"] = Carbon::now()->format("Y-m-d H:i:s");
                        }

                        $sheetData[] = $rowAsAssoc;
                    }
                }
            }

            $data[$sheetName] = $sheetData;
        }

        foreach ($data as $key => $value) {
            echo "======= IMPORTING DATA $key ==========\n\n";

            DB::table($key)->insert($data[$key]);

            echo "======= IMPORT DATA $key SUCCESFULLY ==========\n\n";
        }
    }
}
