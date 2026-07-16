<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class CollectionExport implements FromArray, WithHeadings, ShouldAutoSize, WithColumnWidths, WithEvents, WithStyles, WithColumnFormatting
{
    use Exportable;
    protected $data;
    protected $fields;
    protected $head;
    public function __construct($data, $fields, $head)
    {
        $this->data = $data;
        $this->fields = $fields;
        $this->head = $head;
    }
    public function array(): array
    {
        $data = collect($this->data)->map(function ($item) {
            $rows = [];
            foreach ($this->fields as $key => $value) {
                if (str_contains($value, '->')) {
                    $split = explode("->", $value);
                    if (count($split) == 3) {
                        $rows[$key] = $item->{$split[0]}->{$split[1]}->{$split[2]} ?? "-";
                        # check spesifik fields 
                        if ($split[2] == 'phone' || $split[2] == 'phone' || $split[2] == 'identity_number') {
                            $rows[$key] = $item->{$split[0]}->{$split[1]}->{$split[2]} ? $item->{$split[0]}->{$split[1]}->{$split[2]} . " " : "-";;
                        }
                        # check spesifik fields 
                    } else {
                        $rows[$key] = $item->{$split[0]}->{$split[1]} ?? "-";
                        # check spesifik fields 
                        if ($split[1] == 'phone' || $split[1] == 'phone' || $split[1] == 'identity_number') {
                            $rows[$key] = $item->{$split[0]}->{$split[1]} ? $item->{$split[0]}->{$split[1]} . " " : "-";
                        }
                        # check spesifik fields 
                    }
                } else {
                    $rows[$key] = $item->{$value} ?? "-";
                    # check spesifik fields 
                    if ($value == 'phone' || $value == 'phone_number' || $value == 'identity_number') {
                        $rows[$key] = $item->{$value} ? $item->{$value} . " " : "-";
                    }
                    # check spesifik fields 
                }
            }
            return $rows;
        })->toArray();

        return $data;
    }
    public function headings(): array
    {
        return $this->head;
    }

    public function columnWidths(): array
    {
        // for custom width;
        return [];
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT,
            'B' => NumberFormat::FORMAT_TEXT,
            'C' => NumberFormat::FORMAT_TEXT,
            'D' => NumberFormat::FORMAT_TEXT,
            'E' => NumberFormat::FORMAT_TEXT,
            'F' => NumberFormat::FORMAT_TEXT,
            'G' => NumberFormat::FORMAT_TEXT,
            'H' => NumberFormat::FORMAT_TEXT,
            'I' => NumberFormat::FORMAT_TEXT,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function registerEvents(): array
    {

        return [
            AfterSheet::class => function (AfterSheet $event) {
                // $event->sheet->getDelegate()->getRowDimension('1')->setRowHeight(25);
                $event->sheet->getDelegate()->freezePane('A2');
                $event->sheet->getDelegate()->getStyle('A1:ZZ1')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_JUSTIFY);
                $event->sheet->getDelegate()->getStyle('A1:ZZ1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_JUSTIFY);
            },
        ];
    }
}
